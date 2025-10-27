using Newtonsoft.Json;
using QirimJunior.ViewModels;
using SQLite;
using System;
using System.Collections.Generic;
using System.Text;

namespace QirimJunior.Models
{
    [Table("stih")]
    public class PoemModel
    {
        [PrimaryKey, AutoIncrement, Column("id")]
        public int id { get; set; }

        [Column("TitleLat")]
        public string TitleLat { get; set; }

        [Column("PoemLat")]
        public string PoemLat { get; set; }

        [Column("UpdatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public string TitleCyr { get; set; }

        public string PoemCyr { get; set; }

        public string Image { get; set; }
        public string ImageToView
        {
            get
            {
                return string.IsNullOrEmpty(Image) ? string.Empty 
                    : Image.StartsWith("http", StringComparison.Ordinal) ? Image 
                                                                         : $"{CommonSettings.HOST}/uploads/{Image}";
            }
        }

        public string Author { get; set; }

        public string Theme { get; set; }

        public bool IsDeleted { get; set; }

        public bool IsNeedToBeAdded { get; set; }

        public string UniqId { get; set; }

    }
}
