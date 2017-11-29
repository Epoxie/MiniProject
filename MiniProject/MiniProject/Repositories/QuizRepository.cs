using MiniProject.DataAccess;
using MiniProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MiniProject.Repositories
{
    public class QuizRepository
    {
        QuizContext context;

        public QuizRepository()
        {
            context = new QuizContext();
        }

        public IEnumerable<string> GetAllSentences()
        {
            return context.Sentences.ToList().Select(s => s.ToString());
        }


        //
    }
}