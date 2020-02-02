describe("/", function() {
  it("successfully loads", function() {
    cy.visit("/");
    cy.screenshot("/", { capture: "fullPage" });
  });
});
