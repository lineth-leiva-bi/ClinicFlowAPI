using System.ComponentModel.DataAnnotations;

namespace ClinicFlowAPI.DTOs
{
    public class CrearCitaDto
    {
        [Required]
        public DateTime FechaHora { get; set; }

        [Required]
        public string Motivo { get; set; } = string.Empty;

        public string Estado { get; set; } = "Pendiente";

        public string? Observaciones { get; set; }
    }
}