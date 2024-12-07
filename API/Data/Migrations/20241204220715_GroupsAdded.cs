using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class GroupsAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TravelLike_AspNetUsers_UserId",
                table: "TravelLike");

            migrationBuilder.DropForeignKey(
                name: "FK_TravelLike_Travels_TravelId",
                table: "TravelLike");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TravelLike",
                table: "TravelLike");

            migrationBuilder.RenameTable(
                name: "TravelLike",
                newName: "TravelLikes");

            migrationBuilder.RenameIndex(
                name: "IX_TravelLike_TravelId",
                table: "TravelLikes",
                newName: "IX_TravelLikes_TravelId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TravelLikes",
                table: "TravelLikes",
                columns: new[] { "UserId", "TravelId" });

            migrationBuilder.CreateTable(
                name: "Groups",
                columns: table => new
                {
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Groups", x => x.Name);
                });

            migrationBuilder.CreateTable(
                name: "Connections",
                columns: table => new
                {
                    ConnectionId = table.Column<string>(type: "TEXT", nullable: false),
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    GroupName = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Connections", x => x.ConnectionId);
                    table.ForeignKey(
                        name: "FK_Connections_Groups_GroupName",
                        column: x => x.GroupName,
                        principalTable: "Groups",
                        principalColumn: "Name");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Connections_GroupName",
                table: "Connections",
                column: "GroupName");

            migrationBuilder.AddForeignKey(
                name: "FK_TravelLikes_AspNetUsers_UserId",
                table: "TravelLikes",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TravelLikes_Travels_TravelId",
                table: "TravelLikes",
                column: "TravelId",
                principalTable: "Travels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TravelLikes_AspNetUsers_UserId",
                table: "TravelLikes");

            migrationBuilder.DropForeignKey(
                name: "FK_TravelLikes_Travels_TravelId",
                table: "TravelLikes");

            migrationBuilder.DropTable(
                name: "Connections");

            migrationBuilder.DropTable(
                name: "Groups");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TravelLikes",
                table: "TravelLikes");

            migrationBuilder.RenameTable(
                name: "TravelLikes",
                newName: "TravelLike");

            migrationBuilder.RenameIndex(
                name: "IX_TravelLikes_TravelId",
                table: "TravelLike",
                newName: "IX_TravelLike_TravelId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TravelLike",
                table: "TravelLike",
                columns: new[] { "UserId", "TravelId" });

            migrationBuilder.AddForeignKey(
                name: "FK_TravelLike_AspNetUsers_UserId",
                table: "TravelLike",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TravelLike_Travels_TravelId",
                table: "TravelLike",
                column: "TravelId",
                principalTable: "Travels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
