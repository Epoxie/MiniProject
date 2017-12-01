using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MiniProject.Models
{
    public class HighScore
    {
        [Key]
        public int ScoreID { get; set; }
        public string Name { get; set; }
        public int Score { get; set; }
    }
}