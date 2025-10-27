using Newtonsoft.Json;
using QirimJunior.ViewModels;
using SQLite;
using System;
using System.Collections.Generic;
using System.Text;

namespace QirimJunior.Models
{
    [Table("Author")]
    public class Author
    {
        [PrimaryKey, AutoIncrement, Column("id")]
        public int id { get; set; }
        [Column("name")]
        public string Name { get; set; }
    }
}
