using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MiniProject.Models
{
    public class Sentence
    {
        [Key, Display(Name="ID")]
        public int SentenceID { get; set; }
        [Required, Display(Name="Words")]
        public string SentenceWords { get; set; }

        public Sentence()
        {}

        public override string ToString()
        {
            return SentenceWords;
        }
    }
}