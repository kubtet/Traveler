using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class NotificationEntityModified : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NotifiedUser",
                table: "Notifications",
                newName: "NotifierId");

            migrationBuilder.RenameColumn(
                name: "NotifiedBy",
                table: "Notifications",
                newName: "NotifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_NotifierId",
                table: "Notifications",
                column: "NotifierId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_NotifierId",
                table: "Notifications",
                column: "NotifierId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_NotifierId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_NotifierId",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "NotifierId",
                table: "Notifications",
                newName: "NotifiedUser");

            migrationBuilder.RenameColumn(
                name: "NotifiedUserId",
                table: "Notifications",
                newName: "NotifiedBy");
        }
    }
}
