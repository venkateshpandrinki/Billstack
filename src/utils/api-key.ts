import crypto from "crypto"

const API_KEY_PREFIX = "bstk_live_"

export function generateTenantApiKey() {
  const secret = crypto.randomBytes(24).toString("hex")
  const apiKey = `${API_KEY_PREFIX}${secret}`

  return {
    apiKey,
    keyHash: hashApiKey(apiKey),
  }
}

export function hashApiKey(apiKey: string) {
  return crypto.createHash("sha256").update(apiKey).digest("hex")
}

export function getApiKeyFromRequest(req: Request) {
  const authorization = req.headers.get("authorization")
  if (authorization?.startsWith("Bearer ")) {
    const bearerToken = authorization.slice("Bearer ".length).trim()
    if (bearerToken) return bearerToken
  }

  const headerApiKey = req.headers.get("x-api-key")?.trim()
  if (headerApiKey) return headerApiKey

  return null
}
