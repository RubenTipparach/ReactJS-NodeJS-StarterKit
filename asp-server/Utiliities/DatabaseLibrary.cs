using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Data.SqlClient;
using System.Data;
using NLog;

namespace asp_server.Utiliities
{
    class DatabaseLibrary
{
    private static Logger Logger = LogManager.GetCurrentClassLogger();
        private static string env = ConfigurationManager.AppSettings["ServerEnvironment"];
        private static string conStrSel = env + "SqlConnection";
        private static string ConnectionString = ConfigurationManager.ConnectionStrings[conStrSel].ConnectionString;

        /// <summary>
        /// Selects the data as specified in the string. Data is returned via callback function.
        /// </summary>
        /// <param name="selectString">The select string.</param>
        /// <param name="sqlDataReader">The SQL data reader.</param>
        public static void SelectSql(string selectString, Action<SqlDataAdapter> sqlDataReader)
        {
            SelectSql(selectString, (SqlCommand cmd) => { }, sqlDataReader);
        }

        /// <summary>
        /// Selects the data as specified in the string. Data is returned via callback function.
        /// </summary>
        /// <param name="selectString">The select string.</param>
        /// <param name="sqlDataReader">The SQL data reader.</param>
        public static void SelectSql(string selectString, Action<SqlCommand> prepareSql, Action<SqlDataAdapter> sqlDataReader)
        {
            try
            {
                // Usings utilize proper grabage collection techniques to clean up unused objects.
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(selectString))
                    {
                        cmd.Connection = connection;
                        prepareSql(cmd);
                        // cmd.Prepare();
                        cmd.CommandType = CommandType.Text;
                        using (SqlDataAdapter sda = new SqlDataAdapter(cmd))
                        {
                            // This call back delegate allows you to put whatever code,
                            // generalizing this entire procedure.
                            sqlDataReader(sda);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Error(e);
                throw e;
            }
        }

        /// <summary>
        /// Executes the Sql.
        /// </summary>
        /// <param name="execString">The execute string.</param>
        /// <param name="sqlCommmandCallback">The SQL commmand callback.</param>
        public static void ExecSql(string execString, Action<SqlCommand> sqlCommmandCallback)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand cmd = new SqlCommand(execString))
                    {
                        cmd.Connection = connection;

                        // This call back delegate allows you to put whatever code,
                        // generalizing this entire procedure.
                        sqlCommmandCallback(cmd);

                        cmd.CommandType = CommandType.Text;
                        int temp = cmd.ExecuteNonQuery();
                    }

                }
            }
            catch (Exception e)
            {
                Logger.Error(e);
                throw e;
            }
        }

        /// <summary>
        /// Executes the SQL reader.
        /// </summary>
        /// <param name="execString"></param>
        /// <param name="dataReaderCallback"></param>
        public static void ExecSqlReader(string execString, Action<SqlDataReader> dataReaderCallback)
        {
            ExecSqlReader(execString, (SqlCommand cmd) => { }, (SqlDataReader dr) => dataReaderCallback(dr));
        }


        /// <summary>
        /// Executes the SQL reader.
        /// </summary>
        /// <param name="execString">The execute string.</param>
        /// <param name="sqlCommmandCallback">The SQL commmand callback.</param>
        /// <param name="dataReaderCallback">The data reader callback.</param>
        public static void ExecSqlReader(string execString, Action<SqlCommand> sqlCommmandCallback, Action<SqlDataReader> dataReaderCallback)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand cmd = new SqlCommand(execString))
                    {
                        cmd.Connection = connection;

                        // This call back delegate allows you to put whatever code,
                        // generalizing this entire procedure.
                        sqlCommmandCallback(cmd);

                        // cmd.Prepare();
                        cmd.CommandType = CommandType.Text;
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            // Return the results back.
                            dataReaderCallback(dr);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Error(e);
                throw e;
            }
        }

        /// <summary>
        /// Executes the scalar procedure.
        /// </summary>
        /// <param name="execString">The execute string.</param>
        /// <param name="sqlCommmandCallback">The SQL commmand callback.</param>
        /// <param name="objectCallback">The object callback.</param>
        public static void ExecScalarProcedure(string procedureName, Action<SqlCommand> sqlCommmandCallback, Action<Object> objectCallback)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand cmd = new SqlCommand(procedureName))
                    {
                        cmd.Connection = connection;

                        // This call back delegate allows you to put whatever code,
                        // generalizing this entire procedure.
                        sqlCommmandCallback(cmd);

                        cmd.CommandType = CommandType.StoredProcedure;
                        Object obj = cmd.ExecuteScalar();

                        // Return the results back.
                        objectCallback(obj);
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Error(e);
                throw e;
            }
        }

        /// <summary>
        /// Execute a scalar sql.
        /// </summary>
        /// <param name="query"></param>
        /// <param name="sqlCommmandCallback"></param>
        /// <param name="objectCallback"></param>
        public static void ExecScalarSql(string query, Action<SqlCommand> sqlCommmandCallback, Action<Object> objectCallback)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand cmd = new SqlCommand(query))
                    {
                        cmd.Connection = connection;

                        // This call back delegate allows you to put whatever code,
                        // generalizing this entire procedure.
                        sqlCommmandCallback(cmd);

                        // cmd.Prepare();
                        cmd.CommandType = CommandType.Text;
                        object obj = cmd.ExecuteScalar();

                        // Return the results back.
                        objectCallback(obj);
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Error(e);
                throw e;
            }
        }


        /// <summary>
        /// This method inserts data from a datable into a specified sql table.
        /// </summary>
        public static void ExecBulkCopy(string tableName, DataTable table)
        {
            throw new NotImplementedException("SQL Bulk Copy method not yet availible in OleDb library.");
        }

        /// <summary>
        /// Fill a datatable with sql from a specified query.
        /// Parameters can be added via the sql command callback.
        /// </summary>
        public static void ExecFillDataTable(string query, DataTable table, Action<SqlCommand> sqlCommmandCallback = null)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand cmd = new SqlCommand(query, connection))
                    {
                        if (sqlCommmandCallback != null)
                        {
                            // This call back delegate allows you to put whatever code,
                            // generalizing this entire procedure.
                            sqlCommmandCallback(cmd);
                        }

                        // cmd.Prepare();
                        cmd.CommandType = CommandType.Text;

                        // Return the results back.
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(table);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Error(e);
                throw e;
            }
        }

        /// <summary>
        /// Concat parameters together so that a where clause can filter on many string parameters.
        /// </summary>
        /// <param name="parameters"></param>
        /// <returns></returns>
        public static Tuple<string, SqlParameter[]> MakeSqlParameterPair(List<string> parameters)
        {
            SqlParameter[] paramPairs = new SqlParameter[parameters.Count];
            string fullQueryList = "";

            for (int i = 0; i < parameters.Count; i++)
            {
                paramPairs[i] = new SqlParameter("@parameter" + i, parameters[i]);
            }

            fullQueryList = string.Join(",", paramPairs.Select(p => p.ParameterName));

            return new Tuple<string, SqlParameter[]>(fullQueryList, paramPairs);
        }

        /// <summary>
        /// Integer version of parameter pairs.
        /// </summary>
        /// <param name="parameters"></param>
        /// <returns></returns>
        public static Tuple<string, SqlParameter[]> MakeSqlParameterPair(List<int> parameters)
        {
            SqlParameter[] paramPairs = new SqlParameter[parameters.Count];
            string fullQueryList = "";

            for (int i = 0; i < parameters.Count; i++)
            {
                paramPairs[i] = new SqlParameter("@parameter" + i, parameters[i]);
            }

            fullQueryList = string.Join(",", paramPairs.Select(p => p.ParameterName));

            return new Tuple<string, SqlParameter[]>(fullQueryList, paramPairs);
        }
    }
}