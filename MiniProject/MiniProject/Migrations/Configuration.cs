namespace MiniProject.Migrations
{
    using MiniProject.Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<MiniProject.DataAccess.QuizContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(MiniProject.DataAccess.QuizContext context)
        {
            context.Sentences.AddOrUpdate(
                s => s.SentenceID,
                new Sentence { SentenceID = 1, SentenceWords = "Today is a nice day." },
                new Sentence { SentenceID = 2, SentenceWords = "Was yesterday a nice day?" },
                new Sentence { SentenceID = 3, SentenceWords = "I hope that tomorrow is also a nice day!" }
                );
        }
    }
}
