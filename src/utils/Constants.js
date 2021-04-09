export const Constants = {
  repaymentPeriod: [
    {
      name: "On Period",
      value: "On Period"
    },
    {
      name: "Grace Period",
      value: "Grace Period"
    },
    {
      name: "On Penalty",
      value: "On Penalty"
    }
  ],
  contractStatus: [
    {
      name: "Active",
      value: "ACTIVE"
    },
    {
      name: "Renewal",
      value: "RENEWAL"
    }
  ],
  keyValueSettlement: [
    { key: "CLIENT_ID", value: "merchant_id" },
    { key: "NAME", value: "merchant_name" },
    { key: "CONTRACT_NUMBER", value: "contract_number" },
    { key: "LENDER_TYPE", value: "category_type" },
    { key: "COMPANY_NAME", value: "lender" },
    { key: "SIGN_IN_DATE", value: "date" },
    { key: "DUE_DATE_PAYMENT", value: "due_date" },
    { key: "TERM_DAY", value: "tenor" },
    { key: "LOAN_AMOUNT", value: "loan_amount" },
    { key: "DISBURSEMENT_AMOUNT", value: "disbursement_amount" },
    { key: "REPAYMENT_DATE", value: "repayment_date" },
    { key: "PAYMENT_AMOUNT", value: "payment_amount" },
    { key: "PENALTY_DAY", value: "penalty_day" },
    { key: "TOTAL_PAYMENT_AMOUNT", value: "total_payment_amount" },
    { key: "REPAYMENT_PERIOD", value: "repayment_period" },
    { key: "CREATED_AT", value: "created_at" }
  ],
  keyValueSettlementContracts: [
    { key: "MERCHANT_ID", value: "merchant_id" },
    { key: "NAME", value: "merchant_name" },
    { key: "CONTRACT_NO", value: "contract_number" },
    { key: "CATEGORY_TYPE", value: "category_type" },
    { key: "LENDER", value: "lender" },
    { key: "APPLIED_DATE", value: "date" },
    { key: "DUE_DATE", value: "due_date" },
    { key: "TENOR", value: "tenor" },
    { key: "MAX_LOAN", value: "max_amount_allowed" },
    { key: "APPLY_LOAN", value: "loan_amount" },
    { key: "PROCESSING_FEE", value: "processing_fee" },
    { key: "LOAN_DISBURSEMENT", value: "loan_disbursement" },
    { key: "ADMIN_FEE", value: "admin_fee" },
    { key: "AMOUNT_DISBURSEMENT", value: "amount_disbursement" },
    { key: "CONTRACT_STATUS", value: "contract_status" }
  ]
};
