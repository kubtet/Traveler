using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class TravelEntityModified : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Places",
                newName: "CountryName");

            migrationBuilder.AddColumn<string>(
                name: "Cities",
                table: "Travels",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CountryId",
                table: "Travels",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CountryName",
                table: "Travels",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Cities",
                table: "Places",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cities",
                table: "Travels");

            migrationBuilder.DropColumn(
                name: "CountryId",
                table: "Travels");

            migrationBuilder.DropColumn(
                name: "CountryName",
                table: "Travels");

            migrationBuilder.DropColumn(
                name: "Cities",
                table: "Places");

            migrationBuilder.RenameColumn(
                name: "CountryName",
                table: "Places",
                newName: "Name");
        }
    }
}
