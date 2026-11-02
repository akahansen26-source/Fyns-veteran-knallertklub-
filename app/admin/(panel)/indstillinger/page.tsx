import { getSettings } from "@/lib/content";
import { saveSettings } from "@/app/admin/actions";
import Flash, { type SP } from "@/components/admin/Flash";
import ImageField from "@/components/admin/ImageField";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

export default async function AdminSettings({ searchParams }: SP) {
  const s = await getSettings();
  const field = (key: keyof typeof s, label: string, placeholder = "") => (
    <label className="field">
      <span className="label">{label}</span>
      <input name={key} defaultValue={s[key]} placeholder={placeholder} />
    </label>
  );

  return (
    <>
      <h1>Indstillinger & logo</h1>
      <Flash searchParams={searchParams} />
      <form action={saveSettings} className="form">
        <fieldset>
          <legend>Klubben</legend>
          {field("site_name", "Klubbens navn")}
          {field("tagline", "Undertitel (vises under navnet)")}
          <ImageField name="logo_image_id" label="Logo (tomt = standardlogoet)" defaultValue={s.logo_image_id} fallback="/logo.png" />
        </fieldset>

        <fieldset>
          <legend>Forsiden</legend>
          {field("hero_title", "Overskrift")}
          <MarkdownEditor name="hero_text" label="Velkomsttekst" defaultValue={s.hero_text} rows={5} />
        </fieldset>

        <fieldset>
          <legend>Kontakt (vises nederst på alle sider)</legend>
          {field("contact_name", "Kontaktperson")}
          <div className="row">
            {field("contact_email", "E-mail")}
            {field("contact_phone", "Telefon")}
          </div>
          {field("address", "Adresse")}
          <div className="row">
            {field("cvr", "CVR")}
            {field("facebook_url", "Facebook-link", "https://www.facebook.com/...")}
          </div>
          {field("footer_text", "Tekst nederst på siden")}
        </fieldset>

        <div className="form-actions">
          <button className="btn btn-red">Gem indstillinger</button>
        </div>
      </form>
    </>
  );
}
