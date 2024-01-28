<template>
  <form class="login-form" @submit.prevent="onSubmit">
    <dx-form :form-data="formData" :disabled="loading">
      <dx-item
        data-field="email"
        editor-type="dxTextBox"
        :editor-options="{
          stylingMode: 'filled',
          placeholder: 'Email',
          mode: 'email',
        }"
      >
        <dx-required-rule message="Email is required" />
        <dx-email-rule message="Email is invalid" />
        <dx-label :visible="false" />
      </dx-item>
      <dx-item
        data-field="password"
        editor-type="dxTextBox"
        :editor-options="{
          stylingMode: 'filled',
          placeholder: 'Password',
          mode: 'password',
        }"
      >
        <dx-required-rule message="Password is required" />
        <DxStringLengthRule
          :min="8"
          message="The password must be at least 8 characters"
        />
        <dx-label :visible="false" />
      </dx-item>
      <!-- <dx-item
        data-field="rememberMe"
        editor-type="dxCheckBox"
        :editor-options="{ text: 'Remember me', elementAttr: { class: 'form-text' } }"
      >
        <dx-label :visible="false" />
      </dx-item> -->
      <dx-button-item>
        <dx-button-options
          width="100%"
          type="default"
          template="signInTemplate"
          :use-submit-behavior="true"
        >
        </dx-button-options>
      </dx-button-item>
      <!-- <dx-item>
        <template #default>
          <div class="link">
            <router-link to="/reset-password">Forgot password?</router-link>
          </div>
        </template>
      </dx-item> -->
      <dx-button-item>
        <dx-button-options
          text="Create an account"
          width="100%"
          :on-click="onCreateAccountClick"
        />
      </dx-button-item>
      <template #signInTemplate>
        <div>
          <span class="dx-button-text">
            <dx-load-indicator
              v-if="loading"
              width="24px"
              height="24px"
              :visible="true"
            />
            <span v-if="!loading">Sign In</span>
          </span>
        </div>
      </template>
    </dx-form>
  </form>
</template>

<script>
import DxLoadIndicator from "devextreme-vue/load-indicator";
import DxForm, {
  DxItem,
  DxEmailRule,
  DxRequiredRule,
  DxLabel,
  DxButtonItem,
  DxButtonOptions,
  DxStringLengthRule,
} from "devextreme-vue/form";
import notify from "devextreme/ui/notify";

import auth from "../auth";

import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const formData = reactive({
      email: "admin@gmail.com",
      password: "12345678",
    });
    const loading = ref(false);

    function onCreateAccountClick() {
      router.push("/create-account");
    }

    async function onSubmit() {
      const { email, password } = formData;
      loading.value = true;
      store
        .dispatch("auth/login", formData)
        .then((res) => {
          const token = res.data.data.access_token;
          let tokenData = token.split(".")[1];
          const decode = JSON.parse(atob(tokenData));

          store
            .dispatch("auth/detailUser", decode.sub)
            .then((res) => {
              console.log(res);
              if (res.data.data.roles == "admin") {
                router.push({ path: "/home" });
              } else {
                router.push({ path: "/user/home" });
              }
            })
            .catch((e) => {
              console.log("error detail user");
            });
          notify("Login Berhasil", "success", 2000);
        })
        .catch((e) => {
          loading.value = false;
          if (e.response.status == 400) {
            notify(
              "Username / Password anda salah! Silahkan isi dengan benar !!",
              "error",
              2000
            );
          } else {
            notify("System Error", "error", 2000);
            console.log(e.response);
          }
        });
    }

    return {
      formData,
      loading,
      onCreateAccountClick,
      onSubmit,
    };
  },
  components: {
    DxLoadIndicator,
    DxForm,
    DxEmailRule,
    DxRequiredRule,
    DxItem,
    DxLabel,
    DxButtonItem,
    DxButtonOptions,
    DxStringLengthRule,
  },
};
</script>

<style lang="scss">
@import "../themes/generated/variables.base.scss";

.login-form {
  .link {
    text-align: center;
    font-size: 16px;
    font-style: normal;

    a {
      text-decoration: none;
    }
  }

  .form-text {
    margin: 10px 0;
    color: rgba($base-text-color, alpha($base-text-color) * 0.7);
  }
}
</style>
