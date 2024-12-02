using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class CascadeDeletionOfTravel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Travels_TravelId",
                table: "Photos");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Travels_TravelId",
                table: "Photos",
                column: "TravelId",
                principalTable: "Travels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Travels_TravelId",
                table: "Photos");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Travels_TravelId",
                table: "Photos",
                column: "TravelId",
                principalTable: "Travels",
                principalColumn: "Id");
        }
    }
}
