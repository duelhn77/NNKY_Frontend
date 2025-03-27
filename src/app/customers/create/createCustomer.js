"use server";
import { revalidatePath } from "next/cache";

const createCustomer = async (formData) => {
  const creating_customer_name = formData.get("customer_name");
  const creating_customer_id = formData.get("customer_id");
  const creating_age = formData.get("age");
  const creating_gender = formData.get("gender");


  // バリデーションチェック
  if (!creating_customer_name) {
    throw new Error("名前が未入力です");
  }
  if (!creating_customer_id.trim()) {
    throw new Error("顧客IDが未入力です");
  }
  if (!creating_age.trim()) {
    throw new Error("年齢が未入力です");
  }
  if (!creating_gender.trim()) {
    throw new Error("性別が未入力です");
  }


  const body_msg = JSON.stringify({
    customer_name: creating_customer_name,
    customer_id: creating_customer_id,
    age: creating_age,
    gender: creating_gender,
  });

  const res = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + "/customers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body_msg,
  });
  if (!res.ok) {
    throw new Error("Failed to create customer");
  }

  revalidatePath(`/customers`);
};

export default createCustomer;
