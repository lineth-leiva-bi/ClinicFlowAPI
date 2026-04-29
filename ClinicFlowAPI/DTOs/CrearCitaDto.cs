using System.ComponentModel.DataAnnotations;

namespace ClinicFlowAPI.DTOs
{
    public class CrearCitaDto
    {
        [Required]
        public int ClienteId { get; set; }

        [Required]
        public DateTime FechaHora { get; set; }

        [Required]
        public string Motivo { get; set; } = string.Empty;

        public string Estado { get; set; } = "Pendiente";

        public string? Observaciones { get; set; }
    }
}