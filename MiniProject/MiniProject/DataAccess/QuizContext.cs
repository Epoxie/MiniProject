using MiniProject.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace MiniProject.DataAccess
{
    public class QuizContext : DbContext
    {
        public DbSet<Sentence> Sentences { get; set; }

        public QuizContext() : base("DefaultConnection") {}
    }
}