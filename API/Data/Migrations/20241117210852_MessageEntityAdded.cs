﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class MessageEntityAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TravelPlaces");

            migrationBuilder.DropTable(
                name: "Places");

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SenderUsername = table.Column<string>(type: "TEXT", nullable: false),
                    RecipientUsername = table.Column<string>(type: "TEXT", nullable: false),
                    Content = table.Column<string>(type: "TEXT", nullable: false),
                    DateRead = table.Column<DateTime>(type: "TEXT", nullable: true),
                    MessageSent = table.Column<DateTime>(type: "TEXT", nullable: false),
                    SenderDeleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    RecipientDeleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    SenderId = table.Column<int>(type: "INTEGER", nullable: false),
                    RecipientId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Messages_Users_RecipientId",
                        column: x => x.RecipientId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Messages_Users_SenderId",
                        column: x => x.SenderId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Messages_RecipientId",
                table: "Messages",
                column: "RecipientId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_SenderId",
                table: "Messages",
                column: "SenderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.CreateTable(
                name: "Places",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Cities = table.Column<string>(type: "TEXT", nullable: false),
                    CountryName = table.Column<string>(type: "TEXT", nullable: false),
                    Latitude = table.Column<decimal>(type: "TEXT", nullable: false),
                    Longitude = table.Column<decimal>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Places", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TravelPlaces",
                columns: table => new
                {
                    TravelId = table.Column<int>(type: "INTEGER", nullable: false),
                    PlaceId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TravelPlaces", x => new { x.TravelId, x.PlaceId });
                    table.ForeignKey(
                        name: "FK_TravelPlaces_Places_PlaceId",
                        column: x => x.PlaceId,
                        principalTable: "Places",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TravelPlaces_Travels_TravelId",
                        column: x => x.TravelId,
                        principalTable: "Travels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TravelPlaces_PlaceId",
                table: "TravelPlaces",
                column: "PlaceId");
        }
    }
}
