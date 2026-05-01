using System.ComponentModel.DataAnnotations;

namespace ClinicFlowAPI.Models
{
    public class Usuario
    {

        public int Id { get; set; }

        public string usuario { get; set; } = string.Empty;

        public string contrasenna { get; set; } = string .Empty;    

        public string rol {  get; set; } = "Usuario";

        public int? ClienteId { get; set; } 
        public Cliente? Cliente { get; set; }

    }
}
