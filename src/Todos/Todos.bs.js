'use strict';

var $$Array = require("bs-platform/lib/js/array.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Fetch = require("bs-fetch/src/Fetch.bs.js");
var React = require("react");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var Activities$TodolistReason = require("../Activities/Activities.bs.js");

function makeState(state, action) {
  if (typeof state !== "number") {
    return state;
  }
  if (state !== 1) {
    if (state !== 0 || action !== 0) {
      return state;
    } else {
      return /* LoadingTodos */1;
    }
  }
  switch (action) {
    case /* Fetch */0 :
        return state;
    case /* FetchSuccess */1 :
        return /* LoadedTodos */{
                _0: []
              };
    case /* FetchError */2 :
        return /* ErrorFetchingTodos */2;
    case /* FetchEmpty */3 :
        return /* EmptyTodos */3;
    
  }
}

var containerStyle = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center"
};

var addActivityButton = {
  background: "#48a9dc",
  color: "white",
  borderRadius: "4px"
};

function Todos(Props) {
  var match = React.useState(function () {
        return /* Initial */0;
      });
  var setFetchingState = match[1];
  var fetchingState = match[0];
  var match$1 = React.useState(function () {
        return "";
      });
  var setActivityValue = match$1[1];
  var activityValue = match$1[0];
  var match$2 = React.useState(function () {
        return "";
      });
  var setDescriptionValue = match$2[1];
  var descriptionValue = match$2[0];
  React.useEffect((function () {
          Curry._1(setFetchingState, (function (state) {
                  return makeState(state, /* Fetch */0);
                }));
          fetch("http://localhost:3000/todos").then(function (response) {
                    return response.json();
                  }).then(function (jsonResponse) {
                  Curry._1(setFetchingState, (function (state) {
                          if (jsonResponse.length > 0) {
                            return /* LoadedTodos */{
                                    _0: jsonResponse
                                  };
                          } else {
                            return makeState(state, /* FetchEmpty */3);
                          }
                        }));
                  return Promise.resolve(undefined);
                }).catch(function (param) {
                Curry._1(setFetchingState, (function (state) {
                        return makeState(state, /* FetchError */2);
                      }));
                return Promise.resolve(undefined);
              });
          
        }), []);
  var tmp;
  if (typeof fetchingState === "number") {
    tmp = fetchingState !== 2 ? (
        fetchingState >= 3 ? React.createElement("button", {
                onClick: (function (param) {
                    return Curry._1(setFetchingState, (function (param) {
                                  return /* LoadedTodos */{
                                          _0: []
                                        };
                                }));
                  })
              }) : "Loading ...."
      ) : "An Error Occured!";
  } else {
    var dataTodos = fetchingState._0;
    tmp = React.createElement(React.Fragment, undefined, React.createElement("div", {
              style: containerStyle
            }, React.createElement("input", {
                  placeholder: "What are you doing?",
                  type: "text",
                  value: activityValue,
                  onChange: (function ($$event) {
                      var value = $$event.target.value;
                      return Curry._1(setActivityValue, (function (param) {
                                    return value;
                                  }));
                    })
                }), React.createElement("input", {
                  placeholder: "Be detail please!!!",
                  type: "text",
                  value: descriptionValue,
                  onChange: (function ($$event) {
                      var value = $$event.target.value;
                      return Curry._1(setDescriptionValue, (function (param) {
                                    return value;
                                  }));
                    })
                }), React.createElement("button", {
                  style: addActivityButton,
                  onClick: (function (_event) {
                      var newTodo = {};
                      newTodo["id"] = Math.random().toString();
                      newTodo["title"] = activityValue;
                      newTodo["description"] = descriptionValue;
                      fetch("http://localhost:3000/todos", Fetch.RequestInit.make(/* Post */2, {
                                        "Content-Type": "application/json"
                                      }, Caml_option.some(JSON.stringify(newTodo)), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined)(undefined)).then(function (prim) {
                                return prim.json();
                              }).then(function (param) {
                              return Promise.resolve(undefined);
                            }).catch(function (param) {
                            Curry._1(setFetchingState, (function (state) {
                                    return makeState(state, /* FetchError */2);
                                  }));
                            return Promise.resolve(undefined);
                          });
                      var newTodo2 = {
                        id: activityValue,
                        title: activityValue,
                        description: descriptionValue
                      };
                      var updatedTodos = $$Array.append(dataTodos, [newTodo2]);
                      Curry._1(setFetchingState, (function (param) {
                              return /* LoadedTodos */{
                                      _0: updatedTodos
                                    };
                            }));
                      Curry._1(setActivityValue, (function (param) {
                              return "";
                            }));
                      return Curry._1(setDescriptionValue, (function (param) {
                                    return "";
                                  }));
                    })
                }, "Add activity")), Belt_Array.map(dataTodos.filter(function (_todo) {
                  return true;
                }), (function (todo) {
                return React.createElement(Activities$TodolistReason.make, {
                            todosData: todo,
                            onDeleteTodos: (function (id) {
                                fetch("http://localhost:3000/todos/" + id, Fetch.RequestInit.make(/* Delete */4, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined)(undefined)).then(function (prim) {
                                      return prim.json();
                                    });
                                var updatedTodos = dataTodos.filter(function (todo) {
                                      return todo.id !== id;
                                    });
                                return Curry._1(setFetchingState, (function (param) {
                                              return /* LoadedTodos */{
                                                      _0: updatedTodos
                                                    };
                                            }));
                              }),
                            onEditTodos: (function (todoId, editedTitle, editedDescription) {
                                var updatedTodoJson = {};
                                updatedTodoJson["id"] = todoId;
                                updatedTodoJson["title"] = editedTitle;
                                updatedTodoJson["description"] = editedDescription;
                                fetch("http://localhost:3000/todos/" + todoId, Fetch.RequestInit.make(/* Put */3, {
                                              "Content-Type": "application/json"
                                            }, Caml_option.some(JSON.stringify(updatedTodoJson)), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined)(undefined)).then(function (prim) {
                                      return prim.json();
                                    });
                                var currentIndex = dataTodos.findIndex(function (todo) {
                                      return todo.id === todoId;
                                    });
                                var updatedTodo = {
                                  id: todoId,
                                  title: editedTitle,
                                  description: editedDescription
                                };
                                var updatedTodos = $$Array.append([], dataTodos);
                                Caml_array.set(updatedTodos, currentIndex, updatedTodo);
                                return Curry._1(setFetchingState, (function (param) {
                                              return /* LoadedTodos */{
                                                      _0: updatedTodos
                                                    };
                                            }));
                              }),
                            key: todo.id
                          });
              })));
  }
  return React.createElement("div", undefined, React.createElement("div", undefined, tmp));
}

var make = Todos;

exports.makeState = makeState;
exports.containerStyle = containerStyle;
exports.addActivityButton = addActivityButton;
exports.make = make;
/* react Not a pure module */
