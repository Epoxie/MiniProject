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
                new Sentence { SentenceID = 1, SentenceWords = "I scream, you scream, we all scream for ice cream." },
                new Sentence { SentenceID = 2, SentenceWords = "How many boards could the Mongols hoard if the Mongol hordes got bored?" },
                new Sentence { SentenceID = 3, SentenceWords = "This is madness!" },
                new Sentence { SentenceID = 4, SentenceWords = "How much wood would a woodchuck chuck if a woodchuck could chuck wood?" },
                new Sentence { SentenceID = 5, SentenceWords = "A woodchuck would chuck as much wood as a woodchuck could chuck if a woodchuck could chuck wood." },
                new Sentence { SentenceID = 6, SentenceWords = "Where’s the peck of pickled peppers Peter Piper picked?" }
                );
        }
    }
}
