using System.ComponentModel.DataAnnotations;

namespace ClinicFlowAPI.Models
{
    public class Cita
    {
        public int Id { get; set; }

        [Required]
        public int ClienteId { get; set; }

        [Required]
        public DateTime FechaHora { get; set; }

        [Required]
        public string Motivo { get; set; }

        public string Estado { get; set; } = "Pendiente";

        //?puede ser null
        public string? Observaciones { get; set; }

        // Relación con Cliente
        public Cliente Cliente { get; set; }

    }
}
