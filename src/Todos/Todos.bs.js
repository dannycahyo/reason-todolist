'use strict';

var $$Array = require("bs-platform/lib/js/array.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Fetch = require("bs-fetch/src/Fetch.bs.js");
var React = require("react");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var Activities$TodolistReason = require("../Activities/Activities.bs.js");

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
        return [];
      });
  var setDataTodos = match[1];
  var dataTodos = match[0];
  var match$1 = React.useState(function () {
        return false;
      });
  var setLoading = match$1[1];
  var match$2 = React.useState(function () {
        return false;
      });
  var setError = match$2[1];
  var match$3 = React.useState(function () {
        return "";
      });
  var setActivityValue = match$3[1];
  var activityValue = match$3[0];
  var match$4 = React.useState(function () {
        return "";
      });
  var setDescriptionValue = match$4[1];
  var descriptionValue = match$4[0];
  React.useEffect((function () {
          Curry._1(setLoading, (function (param) {
                  return true;
                }));
          Curry._1(setError, (function (param) {
                  return false;
                }));
          fetch("http://localhost:3000/todos").then(function (response) {
                    return response.json();
                  }).then(function (jsonResponse) {
                  Curry._1(setDataTodos, (function (_prevTodos) {
                          return jsonResponse;
                        }));
                  Curry._1(setLoading, (function (param) {
                          return false;
                        }));
                  return Promise.resolve(undefined);
                }).catch(function (param) {
                Curry._1(setError, (function (param) {
                        return true;
                      }));
                Curry._1(setDataTodos, (function (_prevTodos) {
                        return [];
                      }));
                Curry._1(setLoading, (function (param) {
                        return false;
                      }));
                return Promise.resolve(undefined);
              });
          
        }), []);
  var handleDeleteTodo = function (id) {
    fetch("http://localhost:3000/todos/" + id, Fetch.RequestInit.make(/* Delete */4, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined)(undefined)).then(function (prim) {
          return prim.json();
        });
    var updatedTodo = dataTodos.filter(function (todo) {
          return todo.id !== id;
        });
    return Curry._1(setDataTodos, (function (_prevTodos) {
                  return updatedTodo;
                }));
  };
  var handleEditTodo = function (todoId, editedTitle, editedDescription) {
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
    return Curry._1(setDataTodos, (function (_prevTodos) {
                  return updatedTodos;
                }));
  };
  return React.createElement("div", undefined, React.createElement("div", {
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
                          newTodo["id"] = Pervasives.string_of_float(Math.random());
                          newTodo["title"] = activityValue;
                          newTodo["description"] = descriptionValue;
                          fetch("http://localhost:3000/todos", Fetch.RequestInit.make(/* Post */2, {
                                        "Content-Type": "application/json"
                                      }, Caml_option.some(JSON.stringify(newTodo)), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined)(undefined)).then(function (prim) {
                                return prim.json();
                              });
                          var newTodo2 = {
                            id: activityValue,
                            title: activityValue,
                            description: descriptionValue
                          };
                          var updatedTodos = $$Array.append(dataTodos, [newTodo2]);
                          Curry._1(setDataTodos, (function (param) {
                                  return updatedTodos;
                                }));
                          Curry._1(setActivityValue, (function (param) {
                                  return "";
                                }));
                          return Curry._1(setDescriptionValue, (function (param) {
                                        return "";
                                      }));
                        })
                    }, "Add activity")), React.createElement("div", undefined, match$2[0] ? "An Error Occured!" : null, match$1[0] ? "Loading ...." : null, dataTodos.length > 0 ? Belt_Array.map(dataTodos.filter(function (_todo) {
                            return true;
                          }), (function (todo) {
                          return React.createElement(Activities$TodolistReason.make, {
                                      todosData: todo,
                                      onDeleteTodos: handleDeleteTodo,
                                      onEditTodos: handleEditTodo,
                                      key: todo.id
                                    });
                        })) : "There is no activity yet"));
}

var make = Todos;

exports.containerStyle = containerStyle;
exports.addActivityButton = addActivityButton;
exports.make = make;
/* react Not a pure module */
