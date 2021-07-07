import { render, fireEvent } from "@testing-library/vue";

import ConfirmationEasterEggOverlay from "@/components/ConfirmationEasterEggOverlay.vue";

describe("ConfirmationEasterEggOverlay.vue", () => {
  it("should render overlay with close button and iframe", () => {
    const { getByTestId } = render(ConfirmationEasterEggOverlay);

    expect(getByTestId("ceeo_overlay")).toBeVisible();
    expect(getByTestId("ceeo_iframe")).toBeVisible();
    expect(getByTestId("ceeo_btn")).toBeVisible();
  });

  it("should emits close-overlay event when close icon is clicked", async () => {
    const { getByTestId, emitted } = render(ConfirmationEasterEggOverlay);
    const closeButton = getByTestId("ceeo_btn");

    expect(emitted()).not.toHaveProperty("close-overlay");
    fireEvent.click(closeButton);

    expect(emitted()).toHaveProperty("close-overlay");
  });
});
