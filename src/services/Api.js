import axios from "axios";
import Cookie from 'js-cookie'

export default () => {
    let currentUrl = window.location.origin;
    let baseUrl = "";

    if (currentUrl.includes("localhost")) {
        baseUrl = "http://127.0.0.1:8000/api/";
    } else if (currentUrl.includes("10.1.10.24")) {
        baseUrl = "http://10.1.10.24:81/api/";
        console.log('masukan link server');
    } else {
        baseUrl = process.env.VUE_APP_BASE_API_URL;
    }

    var token = Cookie.get('token');
    var api = axios.create({
        baseURL: baseUrl,
        withCredentials: false,
        headers: {
            "Content-Type": "application/json",
            "Authorization":
                "Bearer " + token
        }
    });

    api.interceptors.request.use(function (config) {

        // get User Session
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });

    api.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {

            return Promise.reject(error);
        }
    );

    return api;
};
