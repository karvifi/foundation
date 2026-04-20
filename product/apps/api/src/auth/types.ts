export interface JwtPayload {
  sub: string
  orgId: string
  workspaceId: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  jti: string
  iat: number
  exp: number
  kid?: string
}

export interface AuthContext {
  userId: string
  orgId: string
  workspaceId: string
  role: JwtPayload['role']
  jti: string
}

declare module 'hono' {
  interface ContextVariableMap {
    auth: AuthContext
  }
}
