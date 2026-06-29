"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineCash } from "react-icons/hi";
import { useTranslation } from "@/i18n/useTranslation";

interface ZakatInputs {
  cashOnHand: number;
  bankSavings: number;
  investmentValue: number;
  goldWeight: number;
  goldPricePerGram: number;
  silverWeight: number;
  silverPricePerGram: number;
  businessInventory: number;
  accountsReceivable: number;
  businessCash: number;
  outstandingDebts: number;
  billsDue: number;
}

const DEFAULT_INPUTS: ZakatInputs = {
  cashOnHand: 0,
  bankSavings: 0,
  investmentValue: 0,
  goldWeight: 0,
  goldPricePerGram: 0,
  silverWeight: 0,
  silverPricePerGram: 0,
  businessInventory: 0,
  accountsReceivable: 0,
  businessCash: 0,
  outstandingDebts: 0,
  billsDue: 0,
};

function NumberInput({
  label,
  value,
  onChange,
  placeholder = "0",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
        {label}
      </label>
      <input
        type="number"
        min={0}
        value={value || ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
      />
    </div>
  );
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ZakatPage() {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState<ZakatInputs>(DEFAULT_INPUTS);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("quran-companion-zakat");
    if (stored) {
      try {
        setInputs(JSON.parse(stored));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("quran-companion-zakat", JSON.stringify(inputs));
  }, [inputs]);

  const update = (key: keyof ZakatInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const totalCash = inputs.cashOnHand + inputs.bankSavings + inputs.investmentValue;
  const totalGold = inputs.goldWeight * inputs.goldPricePerGram;
  const totalSilver = inputs.silverWeight * inputs.silverPricePerGram;
  const totalBusiness =
    inputs.businessInventory + inputs.accountsReceivable + inputs.businessCash;
  const totalAssets = totalCash + totalGold + totalSilver + totalBusiness;
  const totalDebts = inputs.outstandingDebts + inputs.billsDue;
  const netWealth = totalAssets - totalDebts;
  const goldNisab = 85 * inputs.goldPricePerGram;
  const silverNisab = 595 * inputs.silverPricePerGram;
  const nisab = Math.min(goldNisab, silverNisab);
  const zakatDue = netWealth >= nisab && nisab > 0;
  const zakatAmount = zakatDue ? netWealth * 0.025 : 0;

  const handleCalculate = () => {
    setShowResult(true);
  };

  const handleShare = () => {
    const text = `Zakat Calculation\n\nTotal Wealth: $${formatCurrency(totalAssets)}\nDeductions: $${formatCurrency(totalDebts)}\nNet Zakatable: $${formatCurrency(netWealth)}\nNisab Threshold: $${formatCurrency(nisab)}\nZakat Amount (2.5%): $${formatCurrency(zakatAmount)}\n\nZakat is one of the 5 pillars of Islam.`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert(t("common.copied"));
    }
  };

  const hasGoldPrice = inputs.goldPricePerGram > 0;
  const hasSilverPrice = inputs.silverPricePerGram > 0;

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <HiOutlineCash className="w-8 h-8 text-[var(--accent)]" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("zakat.title")}
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 ml-11">
          {t("zakat.subtitle")}
        </p>
      </motion.div>

      {/* Cash & Savings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-lg">💰</span> {t("zakat.cash")}
        </h2>
        <div className="space-y-3">
          <NumberInput
            label={t("zakat.cashOnHand")}
            value={inputs.cashOnHand}
            onChange={(v) => update("cashOnHand", v)}
          />
          <NumberInput
            label={t("zakat.bankSavings")}
            value={inputs.bankSavings}
            onChange={(v) => update("bankSavings", v)}
          />
          <NumberInput
            label={t("zakat.investmentValue")}
            value={inputs.investmentValue}
            onChange={(v) => update("investmentValue", v)}
          />
        </div>
        <div className="mt-3 text-right text-sm text-gray-500 dark:text-gray-400">
          {t("zakat.subtotal")}: <span className="font-medium text-gray-900 dark:text-white">${formatCurrency(totalCash)}</span>
        </div>
      </motion.div>

      {/* Gold & Silver */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-lg">🥇</span> {t("zakat.gold")}
        </h2>
        <div className="space-y-3">
          <NumberInput
            label={t("zakat.goldWeight")}
            value={inputs.goldWeight}
            onChange={(v) => update("goldWeight", v)}
          />
          <NumberInput
            label={t("zakat.goldPrice")}
            value={inputs.goldPricePerGram}
            onChange={(v) => update("goldPricePerGram", v)}
          />
          <NumberInput
            label={t("zakat.silverWeight")}
            value={inputs.silverWeight}
            onChange={(v) => update("silverWeight", v)}
          />
          <NumberInput
            label={t("zakat.silverPrice")}
            value={inputs.silverPricePerGram}
            onChange={(v) => update("silverPricePerGram", v)}
          />
        </div>
        <div className="mt-3 text-right text-sm text-gray-500 dark:text-gray-400">
          {t("zakat.subtotal")}: <span className="font-medium text-gray-900 dark:text-white">${formatCurrency(totalGold + totalSilver)}</span>
        </div>
      </motion.div>

      {/* Business Assets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-lg">🏪</span> {t("zakat.business")}
        </h2>
        <div className="space-y-3">
          <NumberInput
            label={t("zakat.inventoryValue")}
            value={inputs.businessInventory}
            onChange={(v) => update("businessInventory", v)}
          />
          <NumberInput
            label={t("zakat.receivable")}
            value={inputs.accountsReceivable}
            onChange={(v) => update("accountsReceivable", v)}
          />
          <NumberInput
            label={t("zakat.businessCash")}
            value={inputs.businessCash}
            onChange={(v) => update("businessCash", v)}
          />
        </div>
        <div className="mt-3 text-right text-sm text-gray-500 dark:text-gray-400">
          {t("zakat.subtotal")}: <span className="font-medium text-gray-900 dark:text-white">${formatCurrency(totalBusiness)}</span>
        </div>
      </motion.div>

      {/* Debts & Liabilities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-lg">📋</span> {t("zakat.debts")}
        </h2>
        <div className="space-y-3">
          <NumberInput
            label={t("zakat.outstandingDebts")}
            value={inputs.outstandingDebts}
            onChange={(v) => update("outstandingDebts", v)}
          />
          <NumberInput
            label={t("zakat.billsDue")}
            value={inputs.billsDue}
            onChange={(v) => update("billsDue", v)}
          />
        </div>
        <div className="mt-3 text-right text-sm text-gray-500 dark:text-gray-400">
          {t("zakat.subtotal")}: <span className="font-medium text-red-500">${formatCurrency(totalDebts)}</span>
        </div>
      </motion.div>

      {/* Nisab Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/50 p-6"
      >
        <h2 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
          <span className="text-lg">⚖️</span> {t("zakat.nisabTitle")}
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-amber-700 dark:text-amber-300">{t("zakat.goldNisab")}</span>
            <span className="font-medium text-amber-900 dark:text-amber-100">
              {hasGoldPrice ? `$${formatCurrency(goldNisab)}` : t("zakat.enterGoldPrice")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-amber-700 dark:text-amber-300">{t("zakat.silverNisab")}</span>
            <span className="font-medium text-amber-900 dark:text-amber-100">
              {hasSilverPrice ? `$${formatCurrency(silverNisab)}` : t("zakat.enterSilverPrice")}
            </span>
          </div>
          <div className="h-px bg-amber-200 dark:bg-amber-700/50 my-2" />
          <div className="flex justify-between">
            <span className="text-amber-700 dark:text-amber-300 font-medium">{t("zakat.currentNisab")}</span>
            <span className="font-bold text-amber-900 dark:text-amber-100">
              {nisab > 0 ? `$${formatCurrency(nisab)}` : t("zakat.enterPrices")}
            </span>
          </div>
        </div>
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-3">
          {t("zakat.nisabInfo")}
        </p>
      </motion.div>

      {/* Calculate Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <button
          onClick={handleCalculate}
          className="w-full py-3.5 rounded-2xl bg-[var(--accent)] text-white font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
        >
          {t("zakat.calculate")}
        </button>
      </motion.div>

      {/* Result Card */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white shadow-xl"
        >
          <h2 className="text-lg font-semibold mb-4">{t("zakat.summary")}</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-emerald-100">{t("zakat.totalWealth")}</span>
              <span className="font-medium">${formatCurrency(totalAssets)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-emerald-100">{t("zakat.totalDeductions")}</span>
              <span className="font-medium text-red-200">-${formatCurrency(totalDebts)}</span>
            </div>
            <div className="h-px bg-emerald-500/50" />
            <div className="flex justify-between text-sm">
              <span className="text-emerald-100">{t("zakat.netAmount")}</span>
              <span className="font-medium">${formatCurrency(netWealth)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-emerald-100">{t("zakat.nisab")}</span>
              <span className="font-medium">${formatCurrency(nisab)}</span>
            </div>
            <div className="h-px bg-emerald-500/50" />
            <div className="flex justify-between items-center pt-2">
              <span className="text-emerald-100 font-medium">{t("zakat.duePercent")}</span>
              <span className="text-3xl font-bold">
                ${formatCurrency(zakatAmount)}
              </span>
            </div>
            <div className="text-center pt-2">
              {zakatDue ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-sm font-medium">
                  ✅ {t("zakat.obligatory")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-sm font-medium">
                  ℹ️ {t("zakat.notObligatory")}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleShare}
            className="mt-4 w-full py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-colors"
          >
            {t("zakat.share")}
          </button>
        </motion.div>
      )}

      {/* Islamic Reminder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 text-center"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          &ldquo;{t("zakat.pillarReminder")}&rdquo;
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {t("zakat.purifyWealth")}
        </p>
      </motion.div>
    </div>
  );
}
