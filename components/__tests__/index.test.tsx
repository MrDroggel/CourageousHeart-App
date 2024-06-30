import { render } from "@testing-library/react-native";
import React from "react";

import TabOneScreen from "../../app/(tabs)";

describe("TabOneScreen should ", () => {
  it("render", () => {
    const { getByText } = render(<TabOneScreen />);

    expect(getByText("Tab One")).toBeDefined();
  });
});
