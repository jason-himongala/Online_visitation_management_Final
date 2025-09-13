import { useEffect } from "react";
import axios from "axios";

import { apiUrl } from "./appConfig";

export default function useCheckAuthStatus() {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const visitor_token = localStorage.getItem("visitor_token");
                const authToken = token || visitor_token;

                await axios.get(apiUrl("api/check_auth_status"), {
                    headers: {
                        Authorization: authToken
                            ? `Bearer ${authToken}`
                            : undefined,
                    },
                });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error("Unauthorized access - 401");
                    // Handle 401 error (e.g., redirect to login page)
                    const appVersion = localStorage.getItem("appVersion");
                    localStorage.clear();
                    if (appVersion) {
                        localStorage.setItem("appVersion", appVersion);
                    }
                    window.location.reload();
                } else {
                    console.error("Error fetching data", error);
                }
            }
        };

        fetchData();
    }, []);

    return "";
}
