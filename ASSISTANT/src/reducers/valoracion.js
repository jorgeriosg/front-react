import * as Immutable from "immutable";

export function valoracionStates(
  state = Immutable.fromJS({
    isFetching: false,
    enabled: false,
    stars: 0,
    comment: null,
    pudoResolver: null,
    overStar: 0,
    servicio: null
  }),
  action
) {
  switch (action.type) {
    case "ENABLED_VALORACION":
      return state.set("enabled", true);
    case "DISABLED_VALORACION":
      return state.withMutations(map => {
        map
          .set("isFetching", false)
          .set("enabled", false)
          .set("stars", 0)
          .set("comment", null)
          .set("pudoResolver", true)
          .set("error", false)
          .set("pudoResolverError", false)
          .set("commentError", false)
          .set("button", false);
      });
    case "SET_STARS_VALORACION":
      return state.set("stars", action.data);
    case "SET_OVER_STAR_VALORACION":
      return state.set("overStar", action.data);
    case "SET_PUDO_RESOLVER_VALORACION":
      return state.set("pudoResolver", action.data);
    case "SET_COMMENT_VALORACION":
      return state.set("comment", action.data);
    case "SEND_VALORACION_START":
      return state.set("isFetching", true);
    case "SEND_VALORACION_END":
      return state.withMutations(map => {
        map
          .set("isFetching", false)
          .set("enabled", false)
          .set("stars", 0)
          .set("comment", null)
          .set("pudoResolver", true)
          .set("error", false)
          .set("pudoResolverError", false)
          .set("commentError", false)
          .set("button", false);
      });
    case "SET_SERVICIO_VALORACION":
      return state.set("servicio", action.data);
    default:
      return state;
  }
}
