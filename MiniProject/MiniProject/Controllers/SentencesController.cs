using MiniProject.Models;
using MiniProject.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MiniProject.Controllers
{
    public class SentencesController : ApiController
    {
        QuizRepository repo;

        public SentencesController()
        {
            repo = new QuizRepository();
        }

        public IEnumerable<string> Get()
        {
            return repo.GetAllSentences();
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
