using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using asp_server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace asp_server.Controllers
{
    [Produces("application/json")]
    [Route("api/comms")]
    public class commsController : Controller
    {
        // GET: api/comms
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "comms1", "comms1" };
        }

        // GET: api/comms/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }
        
        // POST: api/comms
        [HttpPost]
        public IActionResult Post([FromBody]ExampleModel person)
        {
            Console.WriteLine($"{person.FirstName} {person.LastName}");
            return Json(new ExampleModel() { Id = 99, FirstName = "msg1"  + person.FirstName, LastName = "msg2" + person.LastName });
        }
        
        // PUT: api/comms/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }
        
        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
