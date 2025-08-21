const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const crypto = require("crypto");
const pool = require("./db");

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

// const PIPELINE_ID = 11686264;
// const NEW_STATUS_ID = 89830683;
const KOMMO_WEBHOOK_URL = "https://killamuse04.kommo.com/api/v4/leads";
const KOMMO_SECRET_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjVkNGQ2ODVhZWYwOWY0YzBjYjhmYzM3NDQwOTU5YmQ0YTEyMThiN2U4N2I0ZTAzNmVhZjJlODZmMTBmMmRkNTFiMTMxNWQ5ZWUwNWUxNWEyIn0.eyJhdWQiOiJkNzExOWFmMS1lMmEzLTRmNmMtODJmNC1jNWQ1NmU0MWJmZjciLCJqdGkiOiI1ZDRkNjg1YWVmMDlmNGMwY2I4ZmMzNzQ0MDk1OWJkNGExMjE4YjdlODdiNGUwMzZlYWYyZTg2ZjEwZjJkZDUxYjEzMTVkOWVlMDVlMTVhMiIsImlhdCI6MTc1NTAyNDE4NiwibmJmIjoxNzU1MDI0MTg2LCJleHAiOjE3NjU2NzA0MDAsInN1YiI6IjEzNjA1NjM2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjM0OTYwMzcyLCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwidXNlcl9mbGFncyI6MCwiaGFzaF91dWlkIjoiOTI4ZTk2NzAtYmNlZi00MjAzLWE2MzctODNlZTcwYmM4MmI1IiwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.RSS1ipmoYNzfqQkQaYCg5zvJ6Y4pfvQpYvgYCLOQ4jNRxzCcS2UUsV7XMFO2M6AxVePohoEJvhZWxX_4-QEFmGI1Oz-5jdcVqXw0w_r59Vif_fxaNzM4W946EkLZDMBexHpZJdBHvJ6ru-N6vReuJAI33U_HaRuPagVVjC9p5owZUkEfXLmBFEzq6U69aE-rInOB16YoMmCQGBX09MCoNA52Tl2n6BBnIj1t9SgGdwlR-Fqtr7GQcMKzWyyxtMizlu0H8tHFw3q9elab1Bq6BpJ5p-HqWogzauiomdaKId56vM7YCmnGscpszcgOvjLT-LecMtonV6YudC0auQbO8w";


app.use(bodyParser.json());

const leads = {}; // Estructura: { phone: { click_id, ad_info } }

// 🔐 Función para hashear teléfono
function hashSHA256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}


// ---------------------WEBHOOK META WSTP ADS -------------------------------
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

          // Obtener métricas del ad
          const metricsUrl = `https://graph.facebook.com/v23.0/${ad_id}/insights?fields=impressions,reach,spend,clicks,ctr&access_token=${ACCESS_TOKEN}`;
          const metricsRes = await axios.get(metricsUrl);
          const metrics = metricsRes.data?.data?.[0] || {};

          // 🔹 Sincronizar secuencia de ID
          const maxIdRes = await pool.query('SELECT MAX(id) as max_id FROM leads');
          const maxId = maxIdRes.rows[0].max_id || 0;
          await pool.query(`SELECT setval('leads_id_seq', $1)`, [maxId]);

          // Enviar a Kommo y obtener lead_id y estado
          const { lead_id, status_name } = await sendToKommo(name, from, click_id, ad_info, text);

          // Insertar el lead en la BD
          const values = [
            name, from, click_id, ad_info.ad_id, ad_info.ad_name,
            ad_info.adset_id, ad_info.adset_name, ad_info.campaign_id, ad_info.campaign_name,
            text, metrics.impressions || 0, metrics.reach || 0, metrics.spend || 0,
            metrics.clicks || 0, metrics.ctr || 0, 0, lead_id, status_name
          ];

          const query = `
            INSERT INTO leads (
              name, phone, click_id, ad_id, ad_name, adset_id, adset_name, campaign_id, campaign_name,
              message, impressions, reach, spend, clicks, ctr, created_at, lead_value, lead_id, status
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,NOW(),$16,$17,$18)
            RETURNING id;
          `;

          const result = await pool.query(query, values);
          console.log("✅ Lead insertado en DB con ID:", result.rows[0].id);

          // Guardar lead en memoria
          leads[from] = { phone: from, click_id, ad_info, message: text };

          // 🔹 Actualizar totales generales para todos los leads
          const adsRes = await pool.query("SELECT DISTINCT ad_id FROM leads");
          const adIds = adsRes.rows.map(r => r.ad_id);

          let totalImpressions = 0;
          let totalReach = 0;
          let totalSpend = 0;
          let totalClicks = 0;
          let totalCtr = 0;

          for (const adId of adIds) {
            const metricsRes = await pool.query(
              `SELECT
                 MAX(impressions) AS max_impressions,
                 MAX(reach) AS max_reach,
                 MAX(spend) AS max_spend,
                 MAX(clicks) AS max_clicks,
                 MAX(ctr) AS max_ctr
               FROM leads
               WHERE ad_id = $1`,
              [adId]
            );
            const m = metricsRes.rows[0];
            totalImpressions += Number(m.max_impressions || 0);
            totalReach += Number(m.max_reach || 0);
            totalSpend += Number(m.max_spend || 0);
            totalClicks += Number(m.max_clicks || 0);
            totalCtr += Number(m.max_ctr || 0);
          }

          await pool.query(
            `UPDATE leads
             SET total_impressions = $1,
                 total_reach = $2,
                 total_spend = $3,
                 total_clicks = $4,
                 total_ctr = $5`,
            [totalImpressions, totalReach, totalSpend, totalClicks, totalCtr]
          );

          console.log(`✅ Totales generales actualizados:
            total_impressions=${totalImpressions},
            total_reach=${totalReach},
            total_spend=${totalSpend},
            total_clicks=${totalClicks},
            total_ctr=${totalCtr}`);

          console.log("✅ Lead enviado a Kommo:", from);

        } catch (err) {
          console.error("❌ Error al procesar lead:", err.response?.data || err.message);
        }
      } else {
        console.log("📨 Mensaje recibido sin referral. No se guardó tracking.");
      }

      console.log(`🟢 Mensaje de ${from}: ${text}`);
    }
  }
  res.sendStatus(200);
});

async function getPipelineAndStatusIds(pipelineName, statusName) {
  const headers = { Authorization: `Bearer ${KOMMO_SECRET_TOKEN}` };
  const res = await axios.get("https://killamuse04.kommo.com/api/v4/leads/pipelines", { headers });
  const pipelines = res.data._embedded.pipelines;

  const pipeline = pipelines.find(p => p.name === pipelineName);
  if (!pipeline) throw new Error(`Pipeline '${pipelineName}' no encontrado`);

  const status = pipeline._embedded.statuses.find(s => s.name === statusName);
  if (!status) throw new Error(`Status '${statusName}' no encontrado en pipeline '${pipelineName}'`);

  return { pipelineId: pipeline.id, statusId: status.id };
}

// ✅ Crear lead en Kommo
async function sendToKommo(name, phone, click_id, ad_info, message) {
  try {
    const headers = { Authorization: `Bearer ${KOMMO_SECRET_TOKEN}`, "Content-Type": "application/json" };
    // Buscar contacto por teléfono
    const contactsRes = await axios.get(
      `https://killamuse04.kommo.com/api/v4/contacts?query=${phone}`,
      { headers }
    );
    const contacts = contactsRes.data?._embedded?.contacts || [];
    let lead_id = null;
    let status_name = null;
    if (contacts.length > 0) {
      console.log("✅ Hay información del contacto");
      // Obtener leads del contacto
      const fullContactsRes = await axios.get(
        `https://killamuse04.kommo.com/api/v4/contacts?with=leads&query=${phone}`,
        { headers }
      );
      const fullContacts = fullContactsRes.data?._embedded?.contacts || [];
      let activeLead = null;
      let contactId = null;
      for (const contact of fullContacts) {
        contactId = contact.id;
        const leads = contact._embedded?.leads || [];
        activeLead = leads.find((lead) => lead.status_id !== 142 && lead.status_id !== 143);
        if (activeLead) break;
      }
      if (activeLead) {
        // Actualizar lead activo
        const payload = {
          id: activeLead.id,
          pipeline_id: PIPELINE_ID,
          custom_fields_values: [
            { field_id: 542218, values: [{ value: click_id }] },
            { field_id: 542220, values: [{ value: ad_info.campaign_name }] },
            { field_id: 542222, values: [{ value: ad_info.campaign_id }] },
            { field_id: 542224, values: [{ value: ad_info.adset_name }] },
            { field_id: 542226, values: [{ value: ad_info.adset_id }] },
            { field_id: 542276, values: [{ value: ad_info.ad_name }] },
            { field_id: 542278, values: [{ value: ad_info.ad_id }] },
            { field_id: 542280, values: [{ value: message }] }
          ]
        };
        await axios.patch(KOMMO_WEBHOOK_URL, [payload], { headers });
        lead_id = activeLead.id;
        status_name = await fetchStageName(PIPELINE_ID, activeLead.status_id);
    
      } else if (contactId) {
        const { pipelineId, statusId } = await getPipelineAndStatusIds("Embudo de ventas", "Nueva consulta");
        console.log("estamos en LEAD NUEVO")
        console.log("PIPEL", pipelineId)
        console.log("statusID", statusId)
        console.log("🚀 Creando lead con estos datos:");
        console.log({
          name,
          pipeline_id: pipelineId,
          status_id: statusId,
          _embedded: { contacts: [{ id: contactId }] },
          custom_fields_values: [
            { field_id: 542218, values: [{ value: click_id }] },
            { field_id: 542220, values: [{ value: ad_info.campaign_name }] },
            { field_id: 542222, values: [{ value: ad_info.campaign_id }] },
            { field_id: 542224, values: [{ value: ad_info.adset_name }] },
            { field_id: 542226, values: [{ value: ad_info.adset_id }] },
            { field_id: 542276, values: [{ value: ad_info.ad_name }] },
            { field_id: 542278, values: [{ value: ad_info.ad_id }] },
            { field_id: 542280, values: [{ value: message }] }
          ]
        });
        // Crear lead nuevo en etapa "Nueva Consulta"
        const createLeadRes = await axios.post(
          "https://killamuse04.kommo.com/api/v4/leads",
          {
            name,
            pipeline_id: pipelineId,
            status_id: statusId, 
            _embedded: { contacts: [{ id: contactId }] },
            custom_fields_values: [
              { field_id: 542218, values: [{ value: click_id }] },
              { field_id: 542220, values: [{ value: ad_info.campaign_name }] },
              { field_id: 542222, values: [{ value: ad_info.campaign_id }] },
              { field_id: 542224, values: [{ value: ad_info.adset_name }] },
              { field_id: 542226, values: [{ value: ad_info.adset_id }] },
              { field_id: 542276, values: [{ value: ad_info.ad_name }] },
              { field_id: 542278, values: [{ value: ad_info.ad_id }] },
              { field_id: 542280, values: [{ value: message }] }
            ]
          },
          { headers }
        );
        console.log("ID NUEVO",createLeadRes.data.id)
        lead_id = createLeadRes.data.id;
        console.log("LEAD ID", lead_id)
        status_name = "Nueva consulta";
        console.log("✅ Lead creado en Kommo:", lead_id);
      } else {
        console.log("📄 Mandar a Excel: contacto sin lead activo y sin ID");
      }
    } else {
      console.log("📄 Mandar a Excel: contacto no existe en Kommo");
    }
    return { lead_id, status_name };
  } catch (err) {
    console.error("❌ Error en sendToKommo:", err.response?.data || err.message);
    return { lead_id: null, status_name: null };
  }
}






// ---------------------------------------------------------------------------- CAPI -----------------

// LEAD GANADO
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
async function fetchLeadDetails(leadId) {
  const url = `https://killamuse04.kommo.com/api/v4/leads/${leadId}`;
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${KOMMO_SECRET_TOKEN}` }
    });
    // console.log("RESPONSE LEADS completa:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    // console.error('Error fetching lead details:', error.response?.data || error.message);
    return null;
  }
}

async function fetchStageName(pipelineId, statusId) {
  const url = `https://killamuse04.kommo.com/api/v4/leads/pipelines/${pipelineId}`;
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${KOMMO_SECRET_TOKEN}` },
    });
    const stages = response.data?._embedded?.statuses || [];
    const stage = stages.find(s => s.id === statusId);
    return stage ? stage.name : "Etapa desconocida";
  } catch (error) {
    console.error("Error fetching stage name:", error.response?.data || error.message);
    return "Etapa desconocida";
  }
}

function getClickIdFromFields(fields = []) {
  if (!fields || !Array.isArray(fields)) return null;
  const field = fields.find(f => f.field_name === "Click ID");
  return field?.values?.[0]?.value || null;
}

app.post("/kommo/webhook", async (req, res) => {
  const leadUpdate = req.body?.leads?.status?.[0];
  if (!leadUpdate) {
    return res.sendStatus(200);
  }
  let leadDetails = null;
  leadDetails = await fetchLeadDetails(leadUpdate.id);
  console.log("Status ID recibido:", leadUpdate.status_id);
  if (leadUpdate.status_id === "89830699") {
    if (!leadDetails) {
      return res.sendStatus(500);
    }
    const click_id = getClickIdFromFields(leadDetails.custom_fields_values);
    if (click_id) {
      console.log("✅ Click ID encontrado:", click_id);
      try {
        await sendMetaConversion(click_id);
      } catch (e) {
        console.error("Error enviando conversión a Meta CAPI:", e);
      }
    } else {
      console.error("❌ No se encontró Click ID en detalles del lead");
    }
  }
  // 🔹 Obtenemos el nombre real de la etapa desde los detalles del lead
  const newStatus = await fetchStageName(leadDetails.pipeline_id, leadDetails.status_id);
  console.log(`📌 Nueva etapa: ${newStatus}`);
  const now = new Date();
  const updateQuery = `
      UPDATE leads
      SET status = $1,
          updated_at = $2
      WHERE lead_id = $3
      RETURNING *;
    `;
  const result = await pool.query(updateQuery, [newStatus, now, leadUpdate.id])
  if (result.rowCount > 0) {
    console.log(`✅ Lead ${leadUpdate.id} actualizado en BD. Nueva etapa: ${newStatus}`);
  } else {
    console.warn(`⚠️ No se encontró el lead ${leadUpdate.id} en la BD.`);
  }
  res.sendStatus(200);
});

// ✅ Envío a Meta CAPI
async function sendMetaConversion(click_id) {
  const url = `https://graph.facebook.com/v23.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
  const eventTime = Math.floor(Date.now() / 1000);
  const page_id = "361404980388508"
  const payload = {
    data: [
      {
        action_source: "business_messaging",
        event_name: "Purchase", 
        event_time: eventTime,
        messaging_channel: "whatsapp",
        user_data: {
          ctwa_clid: click_id,  
          page_id: page_id      
        },
        custom_data: {
          currency: "USD",
          value: 100
        }
      }
    ]
  };
  try {
    const response = await axios.post(url, payload);
    console.log("📈 Conversión enviada a Meta CAPI:", response.data);
  } catch (error) {
    console.error("❌ Error al enviar conversión a Meta CAPI:", error.response?.data || error.message);
  }
}

// ✅ Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
