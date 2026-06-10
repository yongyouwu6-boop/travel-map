import { useState } from "react";

const initialForm = {
  name: "",
  region: "",
  days: "1天",
  latitude: "",
  longitude: "",
  intro: "",
  highlights: "",
  food: "",
  transport: "",
  notes: "",
};

function splitList(value) {
  return value
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function findCoordinates(cityName) {
  const query = encodeURIComponent(`${cityName}, France`);
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`
  );
  const results = await response.json();
  const match = results[0];

  if (!match) return null;

  return {
    latitude: Number(match.lat),
    longitude: Number(match.lon),
  };
}

export default function AddCityForm({ onAddCity }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setStatus("");
  }

  async function handleFindCoordinates() {
    if (!form.name.trim()) {
      setError("先填写城市名称，再查找坐标。");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setStatus("");

    try {
      const coordinates = await findCoordinates(form.name.trim());

      if (!coordinates) {
        setError("没有找到这个城市，请手动填写经纬度。");
        return;
      }

      setForm((currentForm) => ({
        ...currentForm,
        latitude: coordinates.latitude.toFixed(4),
        longitude: coordinates.longitude.toFixed(4),
        region: currentForm.region || "法国",
      }));
      setStatus("已找到坐标，可以添加到地图。");
    } catch {
      setError("暂时无法查找坐标，请手动填写经纬度。");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let latitude = Number(form.latitude);
    let longitude = Number(form.longitude);

    if (!form.name.trim()) {
      setError("请填写城市名称。");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setStatus("");

    if (!form.latitude.trim() || !form.longitude.trim()) {
      setStatus("正在自动查找坐标...");
      try {
        const coordinates = await findCoordinates(form.name.trim());
        if (!coordinates) {
          setError("没有找到这个城市，请手动填写经纬度。");
          setIsSubmitting(false);
          return;
        }
        latitude = coordinates.latitude;
        longitude = coordinates.longitude;
      } catch {
        setError("暂时无法自动查找坐标，请手动填写经纬度。");
        setIsSubmitting(false);
        return;
      }
    }

    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      setError("纬度需要填写 -90 到 90 之间的数字。");
      setIsSubmitting(false);
      return;
    }

    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      setError("经度需要填写 -180 到 180 之间的数字。");
      setIsSubmitting(false);
      return;
    }

    onAddCity({
      name: form.name.trim(),
      region: form.region.trim() || "自定义目的地",
      days: form.days.trim() || "1天",
      latitude,
      longitude,
      intro: form.intro.trim() || "这是你添加到路线里的自定义城市，可以继续补充详细攻略。",
      highlights: splitList(form.highlights),
      food: splitList(form.food),
      transport: form.transport.trim() || "按你的行程安排交通方式。",
      notes: form.notes.trim() || "这条攻略保存在当前浏览器里。",
    });
    setForm(initialForm);
    setError("");
    setStatus("已添加，地图上会显示这个城市。");
    setIsSubmitting(false);
  }

  return (
    <form className="add-city-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          城市
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="例如 阿维尼翁"
          />
        </label>
        <label>
          地区
          <input
            value={form.region}
            onChange={(event) => updateField("region", event.target.value)}
            placeholder="例如 普罗旺斯"
          />
        </label>
        <label>
          停留
          <input
            value={form.days}
            onChange={(event) => updateField("days", event.target.value)}
            placeholder="例如 2天"
          />
        </label>
        <label>
          纬度
          <input
            value={form.latitude}
            onChange={(event) => updateField("latitude", event.target.value)}
            placeholder="可留空自动查找"
            inputMode="decimal"
          />
        </label>
        <label>
          经度
          <input
            value={form.longitude}
            onChange={(event) => updateField("longitude", event.target.value)}
            placeholder="可留空自动查找"
            inputMode="decimal"
          />
        </label>
      </div>

      <button
        className="lookup-button"
        type="button"
        onClick={handleFindCoordinates}
        disabled={isSubmitting}
      >
        自动补坐标
      </button>

      <label>
        简介
        <textarea
          value={form.intro}
          onChange={(event) => updateField("intro", event.target.value)}
          placeholder="写一点这个城市为什么值得去"
          rows="3"
        />
      </label>

      <label>
        推荐亮点
        <input
          value={form.highlights}
          onChange={(event) => updateField("highlights", event.target.value)}
          placeholder="教皇宫，断桥，老城散步"
        />
      </label>

      <label>
        美食与体验
        <input
          value={form.food}
          onChange={(event) => updateField("food", event.target.value)}
          placeholder="市集，南法小酒馆，薰衣草主题甜点"
        />
      </label>

      <label>
        交通提示
        <textarea
          value={form.transport}
          onChange={(event) => updateField("transport", event.target.value)}
          placeholder="从上一站如何抵达，市内怎么移动"
          rows="2"
        />
      </label>

      <label>
        实用备注
        <textarea
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          placeholder="预约、季节、避坑或你自己的提醒"
          rows="2"
        />
      </label>

      {error ? <p className="form-error">{error}</p> : null}
      {status ? <p className="form-status">{status}</p> : null}

      <button className="add-city-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "正在添加..." : "添加到路线"}
      </button>
    </form>
  );
}
