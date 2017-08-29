var colors = require('colors');
var logger = require('../logger.js');
var dateFormat = require('dateformat');

module.exports =
class MongoConnectionServer
{
    /*
     * summary: Setting all these dumb varaibles.
     * TODO: Consider splitting up the SOAP API with server queries.
     */
    constructor()
    {
        this.MongoClient = require('mongodb').MongoClient;
        this.assert = require('assert');
        this.url = 'mongodb://localhost:27017/CrashReporting';
    }

    /*
     * summary: Connection test.
     */
    connection()
    {
        var assert = this.assert;

        // Connection URL
        this.MongoClient.connect(this.url, (err, db) => {
            assert.equal(null, err);
            logger.info("Connected successfully to server");
            db.close();
        });
    }

    /*
     * summary:
     *  This method can be used to make standard queries.
     * params:
     *  query - callback method to how queries should be made/handled.
     */
    getDbRead(query)
    {
        var assert = this.assert;

        // Connection URL
        this.MongoClient.connect(this.url, (err, db) => {
            assert.equal(null, err);
            query(db);
            db.close();
        });
    }

    /*
     * summary:
     *  Setting query command, and headers. Is used with express to make SOAP API.
     * params:
     *  query - callback method to how queries should be made/handled.
     *  req - request information given.
     *  res - response message, this is usally appears as a JSON string.
     */
    getDb(query, req, res)
    {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");

        var assert = this.assert;

        // Connection URL
        this.MongoClient.connect(this.url, (err, db) => {
            assert.equal(null, err);

            //console.log("Querying " + name);
            query(db, res);

            db.close();
        });
    }

    /*
     * summary:
     *  A dropdown grabber for simplicity.
     * params:
     *  name - name of the dropdown selected.
     *  req - request information given.
     *  res - response message, this is usally appears as a JSON string.
     */
    getDropdowns(name, req, res)
    {
        this.getDb((db, res) => {
            db.collection("DropdownsOriginal")
                .find( { [name] : { $exists : 1} } )
                .forEach((doc) => {
                    res.send(JSON.stringify(doc[name]));
                });
            },
        req, res);
    }

    /*
     * summary:
     *  Gets all thr drop downs into one dank JSON Rest API.
     * params:
     *  name - name of the dropdown selected.
     *  req - request information given.
     *  res - response message, this is usally appears as a JSON string.
     */
    getAllDropdowns(req, res)
    {
        this.getDb((db, res) => {
            var result = {data: []};
            db.collection("DropdownsOriginal")
                .find({}, { _id: 0 })
                .toArray((err, doc) => {
                    //result.data.push(doc);
                    res.send(JSON.stringify(doc));
                });
            },
        req, res);
    }

    /*
     * summary:
     *  Get crash data.
     * params:
     *  req - request information given.
     *  res - response message, this is usally appears as a JSON string.
     */
    getCrashEvent(req, res)
    {
        var crashId = parseInt(req.params.crashId);
        var assert = this.assert;

        this.getDb((db, res) =>
        {
            var coll = db.collection("CrashEvent")
             .findOne( { id: crashId }, (err, docs) => {
                assert.equal(err, null);
                res.send(JSON.stringify(docs));
            });

        }, req, res);
    }

    /**
     * 
     * @param {any} req
     * @param {any} res
     */
    getCarUnit(req, res) {
        var crashId = parseInt(req.params.crashId);
        var carId = parseInt(req.params.carId);

        console.log("crashId " + crashId + " carId " + carId);
        var assert = this.assert;

        this.getDb((db, res) => {
            var coll = db.collection("CarUnits")
                .findOne(
                {
                    CrashEventId: crashId,
                    CarIndex: carId
                },
                (err, docs) => {
                    assert.equal(err, null);
                    res.send(JSON.stringify(docs));
                });

        }, req, res);
    }

    /**
     * 
     * @param {any} req
     * @param {any} res
     */
    getOccupantUnit(req, res) {
        var crashId = parseInt(req.params.crashId);
        var carId = parseInt(req.params.carId);
        var occupantId = parseInt(req.params.occupantId);

        console.log(JSON.stringify(req.params).yellow);

        var assert = this.assert;
        
        this.getDb((db, res) => {
            var coll = db.collection("OccupantUnits")
                .findOne(
                {
                    CrashEventId: crashId,
                    CarIndex: carId,
                    OccupantIndex: occupantId
                },
                (err, docs) => {
                    assert.equal(err, null);
                    res.send(JSON.stringify(docs));
                });

        }, req, res);
    }

    /*
     * summary:
     *  executes a non-query statement.
     * params:
     *  statement - database statement that needs to be executed.
     */
    executeDbStatement(statement)
    {
        var assert = this.assert;
        this.MongoClient.connect(this.url, (err, db) => {
            assert.equal(null, err);
            statement(db, () => {
                db.close();
            });
        });
    }

    /*
     * summary:
     *  Insert crash events.
     * params:
     *  formData - the form JSON object.
     *  writeMarkerEvent - callback on what to do after form is writen.
     */
    insertEvent(formData, writeMarkerEvent)
    {
        var assert = this.assert;
        var insertDocument = (db, callback) => {
            db.collection('CrashEvent').insertOne(formData, (err, result) => {
                assert.equal(err, null);
                writeMarkerEvent(formData);
                callback();
            });
        };

        this.executeDbStatement(insertDocument);
    }

    /**
     * Update crash events.
     * @param {any} updateStatement - Update statement for changing parts of the event.
     * @param {any} id - The marker Id
     * @param {any} updateMarkerEvent - callback on what to do after form is writen.
     */
    updateEvent(updateStatement, id, updateMarkerEvent = () => { })
    {
        var assert = this.assert;
        var updateEvent = (db, callback) => {
            db.collection('CrashEvent').updateOne(
                { id: id },
                updateStatement,
                { upsert: true });
            updateMarkerEvent(); //... a call back after update has been done.
        };

        this.executeDbStatement(updateEvent);
    }

    /**
     * An update DB statetment, for general purpose,
     * will convert old methods to use this in the future.
     * @param {any} selectStatment
     * @param {any} updateStatement
     * @param {any} collection
     * @param {any} callbackEvent
     */
    updateDb(selectStatment, updateStatement,  collection, callbackEvent)
    {
        var assert = this.assert;

        var name = { collection: collection };

        var updateEvent = (db, callback) => {
            db.collection(name.collection).update(
                selectStatment,
                updateStatement,
                { upsert: true },
                (err, data) => {
                    if (err)
                    {
                        console.log(err);
                    }
                });

            callbackEvent(); //... a call back after update has been done.
        };

        this.executeDbStatement(updateEvent);
    }

    /**
     * An insert method. 
     * @param {any} insertStatement
     * @param {any} callbackEvent
     */
    insertDb(insertStatement, collection, callbackEvent) {
        var assert = this.assert;

        var name = { collection: collection };

        var insertEvent = (db, callback) => {
            db.collection(name.collection).insertOne(
                insertStatement,
                (err, result) => {
                    if (err) {
                        logger.error(err);
                    }
                    else {
                        callbackEvent();
                    }
                })
        };

        this.executeDbStatement(insertEvent);
    }

    /**
     * A delete method. 
     * @param {any} deleteStatement
     * @param {any} callbackEvent
     */
    deleteDb(deleteStatement, collection, callbackEvent)
    {
        var assert = this.assert;

        var name = { collection: collection };

        var deleteEvent = (db, callback) => {
            db.collection(name.collection).remove(
                deleteStatement,
                {
                    justOne: true,
                },
                (err, result) => {
                    if (err) {
                        logger.error(err);
                    }
                    else {
                        callbackEvent();
                    }
                })
        };

        this.executeDbStatement(deleteEvent);
    }

    /**
     * Reads markers for crash events.
     * @param {any} markers populate these with recrods from the query.
     */
    readMarkers(markers)
    {
        var assert = this.assert;

        this.getDbRead((db) =>
        {
            db.collection("CrashEvent").count((e, count) => {
                this.getDbRead((db) => {
                    for (var i = 1; i <= count; i++) {
                        db.collection("CrashEvent").findOne({ id: i }, (err, docs) => {
                            markers.push({ "position": docs.position, "id": docs.id, "color": '#2196F3', "last_user": "" });
                        });
                    }

                })
            });

        });
    }
};