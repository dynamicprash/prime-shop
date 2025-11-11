import { useEffect, useMemo, useRef } from 'react';
import CryptoJS from 'crypto-js';

const RC_ESEWA_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const TEST_SECRET_KEY = '8gBm/:&EnhH.1/q';

const EsewaForm = ({
  amount,
  taxAmount = '0',
  productServiceCharge = '0',
  productDeliveryCharge = '0',
  transactionUuid,
  productCode = 'EPAYTEST',
  successUrl,
  failureUrl,
  signedFieldNames = 'total_amount,transaction_uuid,product_code',
  secretKey = TEST_SECRET_KEY,
}) => {
  const formRef = useRef(null);

  const payload = useMemo(() => {
    const totalAmount = String(amount);
    const signaturePayload = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    const hash = CryptoJS.HmacSHA256(signaturePayload, secretKey);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    return {
      amount: String(amount),
      tax_amount: String(taxAmount),
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      product_service_charge: String(productServiceCharge),
      product_delivery_charge: String(productDeliveryCharge),
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: signedFieldNames,
      signature,
    };
  }, [
    amount,
    taxAmount,
    productServiceCharge,
    productDeliveryCharge,
    transactionUuid,
    productCode,
    successUrl,
    failureUrl,
    signedFieldNames,
    secretKey,
  ]);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.submit();
    }
  }, [payload]);

  return (
    <form ref={formRef} action={RC_ESEWA_URL} method="POST">
      <input type="hidden" name="amount" value={payload.amount} />
      <input type="hidden" name="tax_amount" value={payload.tax_amount} />
      <input type="hidden" name="total_amount" value={payload.total_amount} />
      <input type="hidden" name="transaction_uuid" value={payload.transaction_uuid} />
      <input type="hidden" name="product_code" value={payload.product_code} />
      <input type="hidden" name="product_service_charge" value={payload.product_service_charge} />
      <input type="hidden" name="product_delivery_charge" value={payload.product_delivery_charge} />
      <input type="hidden" name="success_url" value={payload.success_url} />
      <input type="hidden" name="failure_url" value={payload.failure_url} />
      <input type="hidden" name="signed_field_names" value={payload.signed_field_names} />
      <input type="hidden" name="signature" value={payload.signature} />
    </form>
  );
};

export default EsewaForm;
