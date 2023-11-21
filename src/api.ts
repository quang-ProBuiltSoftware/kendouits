import { CustomerList } from "./types";

const apiUrl = process.env.REACT_APP_BASE_URI;
const key = process.env.REACT_APP_AK;
const user = process.env.REACT_APP_USER;
const cid = process.env.REACT_APP_CID;

const authHeaders = (token: string | undefined) => {
  const headers: Record<string, string> = {
    ak: key!,
    user: user!,
    clientPlatform: "Edge",
    cid: cid!,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

const fetchAPI = async <T>(
    url: string,
    token: string | undefined,
    options?: RequestInit
  ): Promise<Response> => {
    const headers = authHeaders(token);
    const mergedOptions: RequestInit = { ...options, headers };
    return fetch(url, mergedOptions);
  };

export const fetchCustomerList = async (token?: string): Promise<
  CustomerList | null | undefined
> => {
  try {
    const response = await fetchAPI(
      `${apiUrl}/v3/Entity/GetList?ListType=Customer`, token
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data: CustomerList = await response.json();
    return data;
  } catch (error: any) {
    console.log(`Error Message: ${error}`);
  }
};
