import React from "react";
import Index from "../index";
import { shallow } from "enzyme";

describe("Index", () => {
  it("should render without throwing an error", () => {
    const wrapper = shallow(<Index />).contains(<div>is</div>);
    expect(wrapper).toBeTruthy();
  });
});
