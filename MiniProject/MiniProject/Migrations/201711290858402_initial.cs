namespace MiniProject.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Sentences",
                c => new
                    {
                        SentenceID = c.Int(nullable: false, identity: true),
                        SentenceWords = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.SentenceID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Sentences");
        }
    }
}
