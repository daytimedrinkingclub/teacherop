// transmit.authorize<{ id: string }>('users/:id', (ctx: HttpContext, { id }) => {
//   return ctx.auth.user?.id === +id
// })

// transmit.authorize<{ id: string }>('chats/:id/messages', async (ctx: HttpContext, { id }) => {
//   const chat = await Chat.findOrFail(+id)

//   return ctx.bouncer.allows('accessChat', chat)
// })

// transmit.authorize()
