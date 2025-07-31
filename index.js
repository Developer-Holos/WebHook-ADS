const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

// 🔧 Configuración
const PIXEL_ID = '1078649547548264';
const ACCESS_TOKEN = 'EAAbbqu8BZCPIBPOCWCZBaVJ8OzaO86d3JPWXOCWiXaKHnkUeeChUkbnqsWFa9ZCLDvMlZAZC9JapyAkmZCIqHJ0kKDknsFZCGy55yUbbVCUev3UGV6AZArf4sX7z7pbALZA9cJuRY05RMZBAgXtrzWmeydcqbXNQZAz26MQdVR5WCd5YNdfaZAA3rFBCqLXE1nPg6QcVEQZDZD';
const VERIFY_TOKEN = "tokenkommo123";
const TEST_EVENT_CODE = "TEST54792";

// -----------CUENTA KOMMO HOLOS----------
// const KOMMO_WEBHOOK_URL = "https://holos.kommo.com/api/v4/leads";
// const KOMMO_SECRET_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImEyYmY1NTNmOTg0NzcyOWVhZGY2Y2Q0M2Y0ZDFhYjMzNDMwZjU3MDUxMDYzYzBjOWZkYWVjYzY1OWM3NjMyOTA4MmE5MTU2ZjRlYTcwNGRhIn0.eyJhdWQiOiIwYTA0ZDRkNi00NmQ4LTQzZDEtYTBhZC05ODUyMmNjNDZkNGUiLCJqdGkiOiJhMmJmNTUzZjk4NDc3MjllYWRmNmNkNDNmNGQxYWIzMzQzMGY1NzA1MTA2M2MwYzlmZGFlY2M2NTljNzYzMjkwODJhOTE1NmY0ZWE3MDRkYSIsImlhdCI6MTc1Mzk3NTk5NywibmJmIjoxNzUzOTc1OTk3LCJleHAiOjE3NTQxNzkyMDAsInN1YiI6IjExNjIyNjM2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMwMDUzMjI1LCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwidXNlcl9mbGFncyI6MSwiaGFzaF91dWlkIjoiZjUzMDJhODctMGU0OC00ZTQwLTg5Y2QtMjM5OWU1N2U1ZGU5IiwiYXBpX2RvbWFpbiI6ImFwaS1nLmtvbW1vLmNvbSJ9.buHsg89e41Zkev1v2mtozoxyqPnQ0LU2PVSsu64D0O6zWUnljXK8rze3g-w2j0KVtK_XdAG9ZVofQ1yrE87ThpE2jKYXk9ULAmT0iwc3t0jOT72QkcBELlhQseqH2RbBR1cPVhrQSGkx5MgszO1VzGBH396vhi_J0Pbv0A0NF-6x8HigoVy-J4tDMKw3jm6n1_Wv-tkWpwaGyr4ZQsz4lNgpfN_dEZFgxmQNpUbTQvDXT0AdtdMORckOwnqr0rk5UVVd_oauROQ1eN5YhHGTZTz_xglcGYAn7djUdi5rCwRYNEFqKg9BjTjOWHnfsbqACYvcL8STHP-YXyyJOsMy5A";

// -----------PIPELINE KOMMO------------------
// const PIPELINE_ID = 7165863; 


// PIPELINE KILLAMUSE
const PIPELINE_ID = 11686271; 
const KOMMO_WEBHOOK_URL = "https://killamuse04.kommo.com/api/v4/leads";
const KOMMO_SECRET_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijc5Y2VjMjNlYWU0NmI0N2EzMWY3YWQ5MjNjMGY3NzczYTFhZThiM2UyMmE4YTk0ZjZmNjRhYWVjNzU0MzM1MDQzMTMwMTk1Yzc1OTM1Y2I1In0.eyJhdWQiOiJkNzExOWFmMS1lMmEzLTRmNmMtODJmNC1jNWQ1NmU0MWJmZjciLCJqdGkiOiI3OWNlYzIzZWFlNDZiNDdhMzFmN2FkOTIzYzBmNzc3M2ExYWU4YjNlMjJhOGE5NGY2ZjY0YWFlYzc1NDMzNTA0MzEzMDE5NWM3NTkzNWNiNSIsImlhdCI6MTc1Mzk4ODgyMiwibmJmIjoxNzUzOTg4ODIyLCJleHAiOjE3NTQ3ODQwMDAsInN1YiI6IjEzNjA1NjM2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjM0OTYwMzcyLCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwidXNlcl9mbGFncyI6MCwiaGFzaF91dWlkIjoiMDUwNjgwZjctOWU2Zi00YmUxLWIxMWMtYzE1YzVmZmNlMDE4IiwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.jg4WtbEa3CF9TRTqsLlsiM0jhW-IJ09makc0UldT4N3YjPzAKKlPgBM9oxjFwCXaF5zkpF9JAWoZOdadhOxfELdsVxKfP3GBoO4-bgQroHkYTmjvZ4nYZQtxhDwOvliExt8EGCpYwZLZ9IIR5oBjlx6nqRw5Og0wGKxwi2OVScrmxeZyj97Gu-XoGNgcq_51ox2BvPkhDuT4sSLbvCEBoa52s-MlRxSYKu9gjb3Zi60dW9IMWMSICvtKEcZeEZJHHR96Bl_ZjUnUdYjYHItxsv_VajZpPXNkJgQfpXstuqtUdZK8zkf3mE1bK7_ggUIGwu2OM5zifZrX7EnkOAkbbQ";


app.use(bodyParser.json());

const leads = {}; // Estructura: { phone: { click_id, ad_info } }

// 🔐 Función para hashear teléfono
function hashSHA256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

// ✅ Verificación del Webhook
app.get("/facebook/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente.");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Verificación fallida.");
    res.sendStatus(403);
  }
});

// ✅ Webhook de mensajes entrantes desde WhatsApp
app.post("/facebook/webhook", async (req, res) => {
  const body = req.body;
  if (body.object !== "whatsapp_business_account") return res.sendStatus(400);
  for (const entry of body.entry) {
    for (const change of entry.changes) {
      const message = change.value?.messages?.[0];
      const from = message?.from;
      const text = message?.text?.body || "";
      const name = change.value?.contacts?.[0]?.profile?.name || "Lead de WhatsApp";
      if (!from || !message) continue;
      if (message.referral?.ctwa_clid) {
        const click_id = message.referral.ctwa_clid;
        const ad_id = message.referral.source_id;
        try {
          // Obtener info del anuncio desde Meta Graph API
          const url = `https://graph.facebook.com/v19.0/${ad_id}?fields=id,name,adset{id,name,campaign{id,name}}&access_token=${ACCESS_TOKEN}`;
          const fbRes = await axios.get(url);
          const adData = fbRes.data;
          const ad_info = {
            ad_id: adData.id,
            ad_name: adData.name,
            adset_id: adData.adset?.id,
            adset_name: adData.adset?.name,
            campaign_id: adData.adset?.campaign?.id,
            campaign_name: adData.adset?.campaign?.name,
          };
          // Guardar lead en memoria
          leads[from] = {
            phone: from,
            click_id,
            ad_info,
            message: text,
          };
          // Enviar a Kommo
          await sendToKommo(name, from, click_id, ad_info, text);
          console.log("✅ Lead enviado a Kommo:", from);
        } catch (err) {
          if (err.response?.data) {
            console.dir(err.response.data, { depth: null });
          } else {
            console.error(err);
          }
          console.error("❌ Error al obtener info de anuncio o enviar a Kommo:", err.response?.data || err.message);
        }
      } else {
        console.log("📨 Mensaje recibido sin referral. No se guardó tracking.");
      }
      console.log(`🟢 Mensaje de ${from}: ${text}`);
    }
  }

  res.sendStatus(200);
});

// ✅ Crear lead en Kommo
async function sendToKommo(name, phone, click_id, ad_info, message) {
  // PAYLOAD KOMMO HOLOS
  // const payload = {
  //   name: `${name} (WhatsApp)`,               
  //   pipeline_id: PIPELINE_ID,  
  //   custom_fields_values: [
  //     { field_id: 797807, values: [{ value: click_id }] },                          // Click ID
  //     { field_id: 797809, values: [{ value: ad_info.campaign_name }] },             // Campaña
  //     { field_id: 797811, values: [{ value: ad_info.campaign_id }] },               // ID Campaña
  //     { field_id: 797813, values: [{ value: ad_info.adset_name }] },                // Conjunto Anuncios
  //     { field_id: 797815, values: [{ value: ad_info.adset_id }] },                  // ID Conjunto Anuncios
  //     { field_id: 797817, values: [{ value: ad_info.ad_name }] },                   // Nombre Anuncio
  //     { field_id: 797819, values: [{ value: ad_info.ad_id }] },                     // ID Anuncio
  //     { field_id: 797821, values: [{ value: message }] }                            // Mensaje
  //   ]
  // };

  // PAYLOAD KILLAMUSE
    const payload = {
    name: `${name} (WhatsApp)`,               
    pipeline_id: PIPELINE_ID,  
    custom_fields_values: [
      { field_id: 542218, values: [{ value: click_id }] },                          // Click ID
      { field_id: 542220, values: [{ value: ad_info.campaign_name }] },             // Campaña
      { field_id: 542222, values: [{ value: ad_info.campaign_id }] },               // ID Campaña
      { field_id: 542224, values: [{ value: ad_info.adset_name }] },                // Conjunto Anuncios
      { field_id: 542226, values: [{ value: ad_info.adset_id }] },                  // ID Conjunto Anuncios
      { field_id: 542276, values: [{ value: ad_info.ad_name }] },                   // Nombre Anuncio
      { field_id: 542278, values: [{ value: ad_info.ad_id }] },                     // ID Anuncio
      { field_id: 542280, values: [{ value: message }] }                            // Mensaje
    ],
    contacts: [
      {
        first_name: name,
        custom_fields_values: [
          {
            field_code: "PHONE",
            values: [{ value: phone, enum_code: "WORK" }]
          }
        ]
      }
    ]
  };

  await axios.post(KOMMO_WEBHOOK_URL, [payload], {
    headers: {
      "Authorization": `Bearer ${KOMMO_SECRET_TOKEN}`,
      "Content-Type": "application/json"
    }
  });
}

// ✅ Ruta para simular conversión
app.post("/conversion", async (req, res) => {
  const { phone } = req.body;
  const lead = leads[phone];

  if (!lead) {
    return res.status(404).json({
      status: "error",
      message: `No se encontró tracking para ${phone}`,
    });
  }

  console.log(`💰 Simulando conversión para ${phone}`);
  await sendMetaConversion(lead.click_id, phone);

  res.json({
    status: "success",
    message: `Conversión simulada para ${phone}`,
    tracking: lead,
  });
});

// ✅ Envío a Meta CAPI
async function sendMetaConversion(click_id, phone) {
  const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
  const hashedPhone = hashSHA256(phone);

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: "https://tusitio.com",
        event_id: click_id,
        custom_data: {
          currency: "USD",
          value: 99.99,
        },
        user_data: {
          fbp: click_id,
          ph: hashedPhone,
        },
      },
    ],
    test_event_code: TEST_EVENT_CODE,
  };

  try {
    const response = await axios.post(url, payload);
    console.log("📈 Conversión enviada a Meta:", response.data);
  } catch (error) {
    console.error("❌ Error al enviar conversión:", error.response?.data || error.message);
  }
}

// ✅ Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
