import { Router, type IRouter } from "express";
import { GenerateCampaignBody } from "@workspace/api-zod";
import { generateCampaign } from "../lib/campaignEngine";

const router: IRouter = Router();

router.post("/generate", async (req, res): Promise<void> => {
  req.log.info({ body: req.body }, "Received campaign generation request");

  const parsed = GenerateCampaignBody.safeParse(req.body);

  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.flatten() }, "Invalid campaign input");
    res.status(400).json({
      error: "Invalid input. Please check all required fields.",
      details: parsed.error.message,
    });
    return;
  }

  try {
    const result = generateCampaign(parsed.data);
    req.log.info(
      { score: result.metadata.overallScore, risk: result.metadata.risk },
      "Campaign generated successfully"
    );
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Campaign generation failed");
    res.status(500).json({
      error: "Failed to generate campaign. Please try again.",
      details: err instanceof Error ? err.message : null,
    });
  }
});

export default router;
