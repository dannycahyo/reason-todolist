'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");

var containerStyle = {
  border: "1px solid #48a9dc",
  display: "flex",
  marginTop: "12px",
  paddingRight: "12px",
  paddingLeft: "12px",
  borderRadius: "12px",
  alignItems: "center",
  justifyContent: "space-between"
};

var buttonGroupStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
};

var deleteButtonStyle = {
  background: "red",
  color: "white",
  marginLeft: "8px",
  borderRadius: "6px"
};

var grupInputStyle = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center"
};

var editButtonStyle = {
  background: "#48a9dc",
  color: "white",
  borderRadius: "4px"
};

var inputStyle = {
  margin: "12px"
};

function Activities(Props) {
  var todosData = Props.todosData;
  var onDeleteTodos = Props.onDeleteTodos;
  var onEditTodos = Props.onEditTodos;
  var match = React.useState(function () {
        return /* Showing */0;
      });
  var setKind = match[1];
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
  return React.createElement("div", {
              key: todosData.id,
              style: containerStyle
            }, match[0] ? React.createElement(React.Fragment, undefined, React.createElement("div", {
                        style: grupInputStyle
                      }, React.createElement("input", {
                            style: inputStyle,
                            value: activityValue,
                            onChange: (function ($$event) {
                                return Curry._1(setActivityValue, $$event.target.value);
                              })
                          }), React.createElement("input", {
                            style: inputStyle,
                            value: descriptionValue,
                            onChange: (function ($$event) {
                                return Curry._1(setDescriptionValue, $$event.target.value);
                              })
                          })), React.createElement("div", {
                        style: buttonGroupStyle
                      }, React.createElement("button", {
                            style: editButtonStyle,
                            onClick: (function (param) {
                                Curry._3(onEditTodos, todosData.id, activityValue, descriptionValue);
                                return Curry._1(setKind, (function (param) {
                                              return /* Showing */0;
                                            }));
                              })
                          }, "Submit"), React.createElement("button", {
                            style: deleteButtonStyle,
                            onClick: (function (_event) {
                                return Curry._1(onDeleteTodos, todosData.id);
                              })
                          }, "Delete"))) : React.createElement(React.Fragment, undefined, React.createElement("div", undefined, React.createElement("h2", undefined, todosData.title), React.createElement("p", undefined, todosData.description)), React.createElement("div", {
                        style: buttonGroupStyle
                      }, React.createElement("button", {
                            style: editButtonStyle,
                            onClick: (function (param) {
                                Curry._1(setKind, (function (param) {
                                        return /* Editing */1;
                                      }));
                                Curry._1(setDescriptionValue, (function (param) {
                                        return todosData.description;
                                      }));
                                return Curry._1(setActivityValue, (function (param) {
                                              return todosData.title;
                                            }));
                              })
                          }, "Edit"), React.createElement("button", {
                            style: deleteButtonStyle,
                            onClick: (function (_event) {
                                return Curry._1(onDeleteTodos, todosData.id);
                              })
                          }, "Delete"))));
}

var make = Activities;

exports.containerStyle = containerStyle;
exports.buttonGroupStyle = buttonGroupStyle;
exports.deleteButtonStyle = deleteButtonStyle;
exports.grupInputStyle = grupInputStyle;
exports.editButtonStyle = editButtonStyle;
exports.inputStyle = inputStyle;
exports.make = make;
/* react Not a pure module */
