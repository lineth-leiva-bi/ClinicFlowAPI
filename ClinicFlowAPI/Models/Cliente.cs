using System.ComponentModel.DataAnnotations;   

namespace ClinicFlowAPI.Models
{
    //empty da un valor inicial vacío

    public class Cliente {
        public int Id { get; set; }

        [Required]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        public string PrimerApellido { get; set; } = string.Empty;

        public string SegundoApellido { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string Telefono { get; set; } = string.Empty;

        public bool Activo { get; set; } = true;
    }
}