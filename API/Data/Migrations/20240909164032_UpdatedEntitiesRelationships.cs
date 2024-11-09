using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedEntitiesRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PublicId",
                table: "Photos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Travels_UserId",
                table: "Travels",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TravelPlaces_PlaceId",
                table: "TravelPlaces",
                column: "PlaceId");

            migrationBuilder.CreateIndex(
                name: "IX_Photos_TravelId",
                table: "Photos",
                column: "TravelId");

            migrationBuilder.CreateIndex(
                name: "IX_Follows_FollowedUserId",
                table: "Follows",
                column: "FollowedUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Follows_Users_FollowedUserId",
                table: "Follows",
                column: "FollowedUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Follows_Users_SourceUserId",
                table: "Follows",
                column: "SourceUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Travels_TravelId",
                table: "Photos",
                column: "TravelId",
                principalTable: "Travels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TravelPlaces_Places_PlaceId",
                table: "TravelPlaces",
                column: "PlaceId",
                principalTable: "Places",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TravelPlaces_Travels_TravelId",
                table: "TravelPlaces",
                column: "TravelId",
                principalTable: "Travels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Travels_Users_UserId",
                table: "Travels",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Follows_Users_FollowedUserId",
                table: "Follows");

            migrationBuilder.DropForeignKey(
                name: "FK_Follows_Users_SourceUserId",
                table: "Follows");

            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Travels_TravelId",
                table: "Photos");

            migrationBuilder.DropForeignKey(
                name: "FK_TravelPlaces_Places_PlaceId",
                table: "TravelPlaces");

            migrationBuilder.DropForeignKey(
                name: "FK_TravelPlaces_Travels_TravelId",
                table: "TravelPlaces");

            migrationBuilder.DropForeignKey(
                name: "FK_Travels_Users_UserId",
                table: "Travels");

            migrationBuilder.DropIndex(
                name: "IX_Travels_UserId",
                table: "Travels");

            migrationBuilder.DropIndex(
                name: "IX_TravelPlaces_PlaceId",
                table: "TravelPlaces");

            migrationBuilder.DropIndex(
                name: "IX_Photos_TravelId",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Follows_FollowedUserId",
                table: "Follows");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "Photos");
        }
    }
}
