using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiniProject.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }

        public ActionResult SentenceBuilder()
        {
            ViewBag.Title = "Sentence Builder";
            return View();
        }

        public ActionResult AnimalQuiz()
        {
            ViewBag.Title = "Animal Quiz";
            return View();
        }
    }
}
