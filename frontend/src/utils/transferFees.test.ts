import { describe, expect, it } from "vitest";

import type { TransferFeeRule } from "../types/currency";
import { estimateTransferFees, transferFeeRules } from "./transferFees";

describe("estimateTransferFees", () => {
  it("calculates fixed plus percentage fees and sorts by BRL received", () => {
    const estimates = estimateTransferFees(1000, 4.9);

    expect(estimates.map((estimate) => estimate.rule.id)).toEqual([
      "wise-estimate",
      "tap-tap-send-estimate",
      "sendwave-estimate",
      "remittance-app-estimate",
      "bank-wire-estimate",
    ]);

    const wise = estimates[0];
    expect(wise.feeUsd).toBeCloseTo(10.25);
    expect(wise.netAmountUsd).toBeCloseTo(989.75);
    expect(wise.effectiveRate).toBeCloseTo(4.9);
    expect(wise.recipientAmountBrl).toBeCloseTo(4849.775);

    const tapTap = estimates[1];
    expect(tapTap.feeUsd).toBeCloseTo(0);
    expect(tapTap.effectiveRate).toBeCloseTo(4.8461);
  });

  it("applies exchange-rate markup separately from provider fees", () => {
    const [bankWire] = estimateTransferFees(
      1000,
      5,
      transferFeeRules.filter((rule) => rule.id === "bank-wire-estimate"),
    );

    expect(bankWire.feeUsd).toBeCloseTo(35);
    expect(bankWire.effectiveRate).toBeCloseTo(4.875);
    expect(bankWire.recipientAmountBrl).toBeCloseTo(4704.375);
  });

  it("supports custom fee scenarios without letting fees exceed the send amount", () => {
    const customRule: TransferFeeRule = {
      id: "custom",
      providerName: "Custom",
      model: "PERCENTAGE_PLUS_FIXED",
      description: "User-entered fee scenario.",
      fixedFeeUsd: 25,
      percentageFee: 0.1,
      exchangeRateMarkup: 0,
      estimatedDelivery: "Custom",
      isLiveQuote: false,
    };

    const [estimate] = estimateTransferFees(20, 5, [customRule]);

    expect(estimate.feeUsd).toBe(20);
    expect(estimate.netAmountUsd).toBe(0);
    expect(estimate.recipientAmountBrl).toBe(0);
  });
});
