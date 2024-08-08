import { Link, Form } from "@remix-run/react"
import { CustomBreadcrumb } from "~/components/custom/custom-breadcrumb"
import { Checkbox } from "~/components/ui/checkbox"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { PrefectureSelect } from "~/components/prefecture-select"
import { FormItem } from "~/components/form-item"
import { useForm } from "@tanstack/react-form"
import { valibotValidator } from "@tanstack/valibot-form-adapter"
import { FormInput } from "~/components/form-input"
import {
  length,
  pipe,
  custom,
  maxLength,
  minLength,
  string,
  regex,
  email,
} from "valibot"
import { FormRequiredBadge } from "~/components/form-required-badge"

/**
 * 新規登録画面
 */
export default function AccountProfileNewPage() {
  const { handleSubmit, useStore, store, Field, Subscribe } = useForm({
    defaultValues: {
      fullName: "",
      fullNameKana: "",
      zip: "",
      stateProvince: "",
      city: "",
      addressLine: "",
      email: "",
      phone: "",
      // password: "",
      // passwordConfirm: "",
    },
    async onSubmit(form) {
      // TODO: 送信
      console.log(form.value)
    },
    validatorAdapter: valibotValidator(),
  })

  const state = useStore((state) => state.values)

  /**
   * 住所自動入力ボタン押下イベント
   * TODO: 住所の自動入力
   */
  const handleAddressSearchButtonClick = async () => {
    try {
      if (state.zip.length === 0) throw new Error("郵便番号を入力してください")

      const response = await fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${state.zip}`,
      )

      if (response.status !== 200) {
        throw new Error("ネットワークエラーが発生しました")
      }

      const json = await response.json()
      // @ts-ignore
      console.log("json", json)
      if (!json.results) throw new Error("郵便番号が存在しません")
      // @ts-ignore
      const result = json.results[0]

      store.setState((state) => {
        return {
          ...state,
          values: {
            ...state.values,
            stateProvince: result.address1,
            city: result.address2 + result.address3,
          },
        }
      })
    } catch (error) {
      // TODO
      window.alert(error)
    }
  }

  return (
    <main className="container pt-4">
      <CustomBreadcrumb
        items={[
          {
            title: "新規会員登録",
            // TODO: 変更する
            href: "/account/profile/new",
          },
        ]}
      />
      <div className="pt-16">
        <div className="lg:pl-24">
          <h1 className="whitespace-pre-wrap text-4xl leading-tight">
            {"REGISTRATION"}
          </h1>
          <p className="pt-1 text-sm opacity-60">{"新規会員登録"}</p>
        </div>
        <hr className="-mx-[1rem] mt-8 pb-8" />
        <div className="lg:px-64">
          {/* <Card className="my-12 bg-cyan-800 text-white">
            <CardContent className="flex justify-center space-x-2 px-4 py-8">
              <GiftIcon style={{ transform: "scale(-1, 1)" }} />
              <span>
                {"新規会員登録で1,000円クーポンをプレゼントいたします。"}
              </span>
            </CardContent>
          </Card> */}
          <Form
            method="post"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleSubmit()
            }}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <Field
                  name="fullName"
                  validators={{
                    onBlur: pipe(
                      string(),
                      minLength(1, "1文字以上で入力してください"),
                      maxLength(128, "128文字以内で入力してください"),
                    ),
                  }}
                  children={(field) => (
                    <FormItem
                      isRequired
                      labelName={"氏名（漢字）"}
                      ariaLabel={"Full Name(Kanji)"}
                      errors={field.state.meta.errors}
                    >
                      <FormInput
                        required={true}
                        aria-required={true}
                        name={field.name}
                        placeholder={"山田太郎"}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        isError={0 < field.state.meta.errors.length}
                      />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Field
                  name="fullNameKana"
                  validators={{
                    onBlur: pipe(
                      string(),
                      minLength(1, "1文字以上で入力してください"),
                      maxLength(128, "128文字以内で入力してください"),
                      regex(/^[\u30A1-\u30F6]+$/, "カタカナで入力してください"),
                    ),
                  }}
                  children={(field) => (
                    <FormItem
                      isRequired
                      labelName={"氏名（カナ）"}
                      ariaLabel={"Full Name(Kana)"}
                      errors={field.state.meta.errors}
                    >
                      <FormInput
                        required={true}
                        aria-required={true}
                        name={field.name}
                        placeholder={"ヤマダタロウ"}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        isError={0 < field.state.meta.errors.length}
                      />
                    </FormItem>
                  )}
                />
              </div>
              {/* <div> */}
              <div className="items-start gap-x-2 lg:flex">
                <div className="w-50 flex-1 space-y-2">
                  <Field
                    name="zip"
                    validators={{
                      onBlur: pipe(
                        string(),
                        length(7, "7文字で入力してください"),
                        regex(/^[0-9]+$/, "数字で入力してください"),
                        // 優しさのバリデーション
                        regex(/^[^-]*$/, "ハイフン“-”は不要です"),
                      ),
                    }}
                    children={(field) => (
                      <FormItem
                        isRequired
                        labelName={"郵便番号（ハイフンなし）"}
                        ariaLabel={"Zip"}
                        errors={field.state.meta.errors}
                      >
                        <FormInput
                          required={true}
                          aria-required={true}
                          name={field.name}
                          placeholder={"半角英数7文字"}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          isError={0 < field.state.meta.errors.length}
                        />
                      </FormItem>
                    )}
                  />
                  {/** TODO: 住所の自動入力 */}
                  {/* <button
                    type="button"
                    className="block pt-2 text-sm underline"
                    onClick={handleAddressSearchButtonClick}
                  >
                    {"住所自動入力"}
                  </button> */}
                </div>
                <div className="w-50 flex-1 space-y-2 max-lg:mt-6">
                  <div className="flex">
                    <Label
                      aria-label="State / Province (zoneCode)"
                      className="text-sm"
                    >
                      {"都道府県"}
                      <FormRequiredBadge />
                    </Label>
                  </div>
                  <Field
                    name="stateProvince"
                    children={(field) => (
                      <PrefectureSelect
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      />
                    )}
                  />
                </div>
              </div>

              {/* </div> */}
              <div className="space-y-2">
                <Field
                  name="city"
                  validators={{
                    onBlur: pipe(
                      string(),
                      minLength(1, "1文字以上で入力してください"),
                      maxLength(128, "128文字以内で入力してください"),
                    ),
                  }}
                  children={(field) => (
                    <FormItem
                      isRequired
                      labelName={"市区町村・町域・番地"}
                      ariaLabel={"City"}
                      errors={field.state.meta.errors}
                    >
                      <FormInput
                        required={true}
                        aria-required={true}
                        name={field.name}
                        placeholder={"市区町村・町域・番地"}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        isError={0 < field.state.meta.errors.length}
                      />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Field
                  name="addressLine"
                  validators={{
                    onBlur: pipe(
                      string(),
                      maxLength(128, "128文字以内で入力してください"),
                    ),
                  }}
                  children={(field) => {
                    return (
                      <FormItem
                        labelName={"建物名・部屋番号"}
                        ariaLabel={"Address line"}
                        errors={field.state.meta.errors}
                      >
                        <FormInput
                          required={true}
                          aria-required={true}
                          name={field.name}
                          placeholder={"建物名・部屋番号"}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          isError={0 < field.state.meta.errors.length}
                        />
                      </FormItem>
                    )
                  }}
                />
              </div>
              <div className="space-y-2">
                <Field
                  name="email"
                  validators={{
                    onBlur: pipe(
                      string(),
                      minLength(1, "1文字以上で入力してください"),
                      maxLength(128, "128文字以内で入力してください"),
                      email("メールアドレスの形式が正しくありません"),
                    ),
                  }}
                  children={(field) => {
                    return (
                      <FormItem
                        isRequired
                        labelName={"メールアドレス（ユーザーID）"}
                        ariaLabel={"Email"}
                        errors={field.state.meta.errors}
                      >
                        <FormInput
                          required={true}
                          aria-required={true}
                          name={field.name}
                          placeholder={"mail@example.com"}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          isError={0 < field.state.meta.errors.length}
                        />
                      </FormItem>
                    )
                  }}
                />
                <label
                  htmlFor="recieve-mail"
                  className="items-top flex cursor-pointer text-sm"
                >
                  <Checkbox id="recieve-mail" className="mr-2 self-center" />
                  <span className="inline-block">
                    {"キャンペーン情報やお得な情報を受け取る"}
                  </span>
                </label>
              </div>
              <div className="flex">
                <div className="w-48 flex-1 space-y-2">
                  <Field
                    name="phone"
                    validators={{
                      onBlur: pipe(
                        string(),
                        regex(/^[0-9]+$/, "数字で入力してください"),
                        // 優しさのバリデーション
                        regex(/^[^-]*$/, "ハイフン“-”は不要です"),
                        // TODO: customでバリデーションすると、border-colorが変化しない
                        custom((input) => {
                          if (typeof input !== "string") return false
                          return !(input.length !== 10 && input.length !== 11)
                        }, "10桁または11桁で入力してください"),
                      ),
                    }}
                    children={(field) => (
                      <FormItem
                        isRequired
                        labelName={"電話番号（ハイフンなし）"}
                        ariaLabel={"Phone"}
                        errors={field.state.meta.errors}
                      >
                        <FormInput
                          required={true}
                          aria-required={true}
                          name={field.name}
                          placeholder={"0000000"}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          isError={0 < field.state.meta.errors.length}
                        />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/** TODO: パスワード認証 */}
              {/* <div className="gap-x-2 lg:flex">
                <div className="w-50 flex-1 space-y-2">
                  <Field
                    name="password"
                    validators={{
                      onBlur: pipe(
                        string(),
                        minLength(8, "8桁以上で入力してください"),
                        maxLength(128, "128桁以内で入力してください"),
                        regex(/^[a-zA-Z0-9]*$/, "半角英数字で入力してください"),
                      ),
                    }}
                    children={(field) => {
                      return (
                        <FormItem
                          isRequired
                          labelName={"パスワード"}
                          ariaLabel={"Password"}
                          errors={field.state.meta.errors}
                        >
                          <FormInput
                            required={true}
                            aria-required={true}
                            name={field.name}
                            placeholder={"パスワード"}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            isError={0 < field.state.meta.errors.length}
                          />
                        </FormItem>
                      )
                    }}
                  />
                  <span className="text-xs opacity-60">
                    {"※パスワードは半角英数8文字以上で入力してください。"}
                  </span>
                </div>
                <div className="w-50 flex-1 space-y-2 max-lg:mt-6">
                  <Field
                    name="passwordConfirm"
                    validators={{
                      onBlur: pipe(
                        string(),
                        minLength(8, "8桁以上で入力してください"),
                        maxLength(128, "128桁以内で入力してください"),
                        value(state.password, "パスワードが一致しません"),
                      ),
                    }}
                    children={(field) => (
                      <FormItem
                        isRequired
                        labelName={"パスワード確認"}
                        ariaLabel={"Confirm Password"}
                        errors={field.state.meta.errors}
                      >
                        <FormInput
                          required={true}
                          aria-required={true}
                          name={field.name}
                          placeholder={"パスワード"}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          isError={0 < field.state.meta.errors.length}
                        />
                      </FormItem>
                    )}
                  />
                </div>
              </div> */}
            </div>
            <div className="space-y-4 pt-12">
              <label
                htmlFor="terms-of-use"
                className="items-top flex cursor-pointer text-sm"
              >
                <Checkbox id="terms-of-use" className="mr-2 self-center" />
                <span className="inline-block">{"利用規約に同意します。"}</span>
                <div>
                  <FormRequiredBadge />
                </div>
              </label>
              <span className="text-xs">
                <Link to={"/terms"} className="underline">
                  {"利用規約"}
                </Link>
                {"をご確認のうえ「同意する」をチェックしてください。"}
              </span>
              <label
                htmlFor="privacy-policy"
                className="items-top flex cursor-pointer text-sm"
              >
                <Checkbox id="privacy-policy" className="mr-2 self-center" />
                <span className="inline-block">
                  {"プライバシーポリシーに同意します。"}
                </span>
                <div>
                  <FormRequiredBadge />
                </div>
              </label>
              <span className="text-xs">
                <Link className="underline" to={"/policies/privacy"}>
                  {"プライバシーポリシー"}
                </Link>
                {"をご確認のうえ「同意する」をチェックしてください。"}
              </span>
              <div className="flex justify-center pt-8">
                <Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <>
                      <Button
                        disabled={!canSubmit || isSubmitting}
                        type="submit"
                        variant={"outline"}
                        className="w-full rounded-3xl border-black py-6"
                      >
                        {"登録する"}
                      </Button>
                    </>
                  )}
                />
              </div>
            </div>
          </Form>
        </div>
      </div>
    </main>
  )
}
