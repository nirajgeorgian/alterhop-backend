require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "c35218de8e124a62f892";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./config/config/configConfig.js":
/*!***************************************!*\
  !*** ./config/config/configConfig.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// import config and make it available globally
var configConfig = function configConfig() {
    var env = "development";
    var config = void 0;
    // import configuration from config
    switch (env) {
        case 'development':
            config = __webpack_require__(/*! ../../config/config/configFiles/config.dev */ "./config/config/configFiles/config.dev.js");
            global.config = config;
        case 'testing':
            config = __webpack_require__(/*! ../../config/config/configFiles/config.test */ "./config/config/configFiles/config.test.js");
            global.config = config;
        case 'production':
            config = __webpack_require__(/*! ../../config/config/configFiles/config.prod */ "./config/config/configFiles/config.prod.js");
            global.config = config;
        default:
            config = __webpack_require__(/*! ../../config/config/configFiles/config.dev */ "./config/config/configFiles/config.dev.js");
            global.config = config;
    }
};

/* harmony default export */ __webpack_exports__["default"] = (configConfig);

/***/ }),

/***/ "./config/config/configFiles/config.dev.js":
/*!*************************************************!*\
  !*** ./config/config/configFiles/config.dev.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var config = {
	expireTime: '30d',
	secrets: {
		JWT_SECRET: 'yeezy350boost@12#'
	},
	mongo: {},
	redis: {},
	postgres: {},
	rethinkdb: {}
};

/* harmony default export */ __webpack_exports__["default"] = (config);

/***/ }),

/***/ "./config/config/configFiles/config.prod.js":
/*!**************************************************!*\
  !*** ./config/config/configFiles/config.prod.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var config = {
	mongo: {},
	redis: {},
	postgres: {},
	rethinkdb: {}
};

/* harmony default export */ __webpack_exports__["default"] = (config);

/***/ }),

/***/ "./config/config/configFiles/config.test.js":
/*!**************************************************!*\
  !*** ./config/config/configFiles/config.test.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/helpers/defineProperty */ "babel-runtime/helpers/defineProperty");
/* harmony import */ var babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);

var config = babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()({
	expireTime: '30d',
	secrets: {
		JWT_SECRET: 'yeezy350boost@12#'
	},
	mongo: {},
	redis: {},
	postgres: {}
}, 'redis', {});

/* harmony default export */ __webpack_exports__["default"] = (config);

/***/ }),

/***/ "./config/env/env.js":
/*!***************************!*\
  !*** ./config/env/env.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/regenerator */ "babel-runtime/regenerator");
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babel-runtime/helpers/asyncToGenerator */ "babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! dotenv */ "dotenv");
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_4__);



var _this = undefined;





var envConfig = function () {
	var _ref = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
		var env;
		return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						env = "development";
						// let envConfig

						_context.t0 = env;
						_context.next = _context.t0 === 'development' ? 4 : _context.t0 === 'dev' ? 4 : _context.t0 === 'testing' ? 9 : _context.t0 === 'test' ? 9 : _context.t0 === 'production' ? 14 : _context.t0 === 'prod' ? 14 : 19;
						break;

					case 4:
						console.log("running on development environment");
						_context.next = 7;
						return __webpack_require__(/*! dotenv */ "dotenv").config({ path: path__WEBPACK_IMPORTED_MODULE_2___default.a.resolve(process.cwd(), 'config/env/.env.dev') });

					case 7:
						return _context.abrupt('return', _context.sent);

					case 9:
						console.log("running on test environment");
						_context.next = 12;
						return __webpack_require__(/*! dotenv */ "dotenv").config({ path: path__WEBPACK_IMPORTED_MODULE_2___default.a.resolve(process.cwd(), 'config/env/.env.test') });

					case 12:
						return _context.abrupt('return', _context.sent);

					case 14:
						console.log("running on production environment");
						_context.next = 17;
						return __webpack_require__(/*! dotenv */ "dotenv").config({ path: path__WEBPACK_IMPORTED_MODULE_2___default.a.resolve(process.cwd(), 'config/env/.env.prod') });

					case 17:
						return _context.abrupt('return', _context.sent);

					case 19:
						_context.next = 21;
						return __webpack_require__(/*! dotenv */ "dotenv").config({ path: path__WEBPACK_IMPORTED_MODULE_2___default.a.resolve(process.cwd(), 'config/env/.env.dev') });

					case 21:
						return _context.abrupt('return', _context.sent);

					case 23:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this);
	}));

	return function envConfig() {
		return _ref.apply(this, arguments);
	};
}();
envConfig();

/* harmony default export */ __webpack_exports__["default"] = (envConfig);

/***/ }),

/***/ "./config/index.js":
/*!*************************!*\
  !*** ./config/index.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _config_configConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config/configConfig */ "./config/config/configConfig.js");
/* harmony import */ var _logs_logs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./logs/logs */ "./config/logs/logs.js");
// Import configuration file and make it available according to the environment



/* harmony default export */ __webpack_exports__["default"] = (function (app) {
	/*
 	configuration for application (not every)
 */
	Object(_config_configConfig__WEBPACK_IMPORTED_MODULE_0__["default"])();
	Object(_logs_logs__WEBPACK_IMPORTED_MODULE_1__["default"])(app);
});

/***/ }),

/***/ "./config/logs/logs.js":
/*!*****************************!*\
  !*** ./config/logs/logs.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var morgan__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! morgan */ "morgan");
/* harmony import */ var morgan__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(morgan__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var rotating_file_stream__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rotating-file-stream */ "rotating-file-stream");
/* harmony import */ var rotating_file_stream__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(rotating_file_stream__WEBPACK_IMPORTED_MODULE_3__);





var logDirectory = path__WEBPACK_IMPORTED_MODULE_1___default.a.join(__dirname, 'log');

// Make sure folder exists or create one folder
var result = fs__WEBPACK_IMPORTED_MODULE_0___default.a.existsSync(logDirectory) || fs__WEBPACK_IMPORTED_MODULE_0___default.a.mkdirSync(logDirectory);
// filename according to environment
var logFileName =  false ? undefined :  true ? 'dev.log' : undefined;

// Creating rotating log files which change after 1 day
var logStream = rotating_file_stream__WEBPACK_IMPORTED_MODULE_3___default()(logFileName || 'dev.log', {
  interval: '1d', // rotate per day
  path: logDirectory
});

var logs = function logs(app) {
  var env = "development";
  switch (env) {
    case 'development':
      app.use(morgan__WEBPACK_IMPORTED_MODULE_2___default()('dev', {
        skip: function skip(req, res) {
          return res.statusCode < 400;
        }
      }));
      app.use(morgan__WEBPACK_IMPORTED_MODULE_2___default()('short', {
        stream: logStream
      }));
      break;
    case 'production':
      app.use(morgan__WEBPACK_IMPORTED_MODULE_2___default()('combined', { stream: logStream }));
      break;
    case 'testing':
      app.use(morgan__WEBPACK_IMPORTED_MODULE_2___default()('common', { stream: logStream }));
      break;
    default:
      app.use(morgan__WEBPACK_IMPORTED_MODULE_2___default()('dev', {
        skip: function skip(req, res) {
          return res.statusCode < 400;
        }
      }));
      app.use(morgan__WEBPACK_IMPORTED_MODULE_2___default()('common', {
        skip: function skip(req, res) {
          return res.statusCode < 400;
        },
        stream: logStream
      }));
      break;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (logs);
/* WEBPACK VAR INJECTION */}.call(this, "config/logs"))

/***/ }),

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function(moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				"[HMR] Consider using the NamedModulesPlugin for module names."
			);
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function(level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function(level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function(level) {
	logLevel = level;
};


/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!**********************************!*\
  !*** (webpack)/hot/poll.js?1000 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function(updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function(err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + (err.stack || err.message));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log(
							"warning",
							"[HMR] Update failed: " + (err.stack || err.message)
						);
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}

/* WEBPACK VAR INJECTION */}.call(this, "?1000"))

/***/ }),

/***/ "./src/db.js":
/*!*******************!*\
  !*** ./src/db.js ***!
  \*******************/
/*! exports provided: mongodb, sequelize, redisClient, mongooseConnect, resolveAll */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mongodb", function() { return mongodb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sequelize", function() { return sequelize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "redisClient", function() { return redisClient; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mongooseConnect", function() { return mongooseConnect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolveAll", function() { return resolveAll; });
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/regenerator */ "babel-runtime/regenerator");
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babel-runtime/helpers/asyncToGenerator */ "babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var babel_runtime_core_js_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! babel-runtime/core-js/promise */ "babel-runtime/core-js/promise");
/* harmony import */ var babel_runtime_core_js_promise__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_core_js_promise__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! sequelize */ "sequelize");
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(sequelize__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var redis__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! redis */ "redis");
/* harmony import */ var redis__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(redis__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_5__);




var _this = undefined;





/*
	@redis connection
	create a redis client and connection is established
*/
var redisClient = redis__WEBPACK_IMPORTED_MODULE_4___default.a.createClient('' + process.env.REDIS_SERVER_PORT, '' + process.env.REDIS_HOST);
var redisConnect = new babel_runtime_core_js_promise__WEBPACK_IMPORTED_MODULE_2___default.a(function (resolve, reject) {
	redisClient.on('error', function (err) {
		// redis error
		console.log('Error occured ' + err.message());
		reject(err.message());
		process.exit();
	});
	redisClient.on('connect', function () {
		console.log('\uD83D\uDE80 Connected to redis redis:6379');
		resolve(redisClient);
	});
});

/*
	@postgress connection
	postgress connected with sequelize package
*/
// console.log(process.env);
var sequelize = new sequelize__WEBPACK_IMPORTED_MODULE_3___default.a('' + process.env.POSTGRES_DB, '' + process.env.POSTGRES_USER, '' + process.env.POSTGRES_PASSWORD, {
	host: '' + process.env.POSTGRES_DB_HOST,
	dialect: '' + process.env.POSTGRES_DB_DIALECT,
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
	operatorsAliases: false
});

var sequelizeConnect = new babel_runtime_core_js_promise__WEBPACK_IMPORTED_MODULE_2___default.a(function (resolve, reject) {
	sequelize.authenticate().then(function () {
		console.log('\uD83D\uDE80 Connected to ' + process.env.POSTGRES_DB + ' postgress database successfully!!');
		resolve(sequelize);
	}).catch(function (err) {
		// postgress connection error
		console.error('Unable to connect to the database: ' + err);
		reject(err);
	});
});

/*
	@mongodb connection
	Database connection for nosql database
*/
var mongoUrl = process.env.MONGO_HOST + '/' + process.env.MONGO_INITDB_DATABASE;
var mongooseConnect = mongoose__WEBPACK_IMPORTED_MODULE_5___default.a.connect(mongoUrl, { autoReconnect: true, useNewUrlParser: true, useCreateIndex: true });
var mongodb = mongoose__WEBPACK_IMPORTED_MODULE_5___default.a.connection;
var mongoConnect = new babel_runtime_core_js_promise__WEBPACK_IMPORTED_MODULE_2___default.a(function (resolve, reject) {
	mongodb.once('open', function () {
		console.log('\uD83D\uDE80 Connected to ' + mongoUrl + ' nosql mongo database');
		resolve(mongodb);
	});
	mongodb.on('error', function () {
		console.error('error  connection to mongodb database');
		reject(new Error("Error connection to mongodb"));
	});
});

var resolveAll = function () {
	var _ref = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
		return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return mongoConnect;

					case 2:
						_context.next = 4;
						return sequelizeConnect;

					case 4:
						_context.next = 6;
						return redisConnect;

					case 6:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this);
	}));

	return function resolveAll() {
		return _ref.apply(this, arguments);
	};
}();



/***/ }),

/***/ "./src/graphql.js":
/*!************************!*\
  !*** ./src/graphql.js ***!
  \************************/
/*! exports provided: GraphQLServer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GraphQLServer", function() { return GraphQLServer; });
/* harmony import */ var babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/helpers/taggedTemplateLiteral */ "babel-runtime/helpers/taggedTemplateLiteral");
/* harmony import */ var babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babel-runtime/regenerator */ "babel-runtime/regenerator");
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! babel-runtime/helpers/asyncToGenerator */ "babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var logrocket__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! logrocket */ "logrocket");
/* harmony import */ var logrocket__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(logrocket__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var graphql_log__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! graphql-log */ "graphql-log");
/* harmony import */ var graphql_log__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(graphql_log__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./db */ "./src/db.js");
/* harmony import */ var _resources_user_user_graphql__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./resources/user/user.graphql */ "./src/resources/user/user.graphql.js");
/* harmony import */ var _resources_applyJob_applyJob_graphql__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./resources/applyJob/applyJob.graphql */ "./src/resources/applyJob/applyJob.graphql.js");
/* harmony import */ var _resources_jobs_jobs_graphql__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./resources/jobs/jobs.graphql */ "./src/resources/jobs/jobs.graphql.js");
/* harmony import */ var _resources_company_company_graphql__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./resources/company/company.graphql */ "./src/resources/company/company.graphql.js");
/* harmony import */ var _resources_organization_organization_graphql__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./resources/organization/organization.graphql */ "./src/resources/organization/organization.graphql.js");
/* harmony import */ var _resources_payment_payment_graphql__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./resources/payment/payment.graphql */ "./src/resources/payment/payment.graphql.js");
/* harmony import */ var _resources_email_email_graphql__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./resources/email/email.graphql */ "./src/resources/email/email.graphql.js");
/* harmony import */ var _resources_email_email_resolver__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./resources/email/email.resolver */ "./src/resources/email/email.resolver.js");
/* harmony import */ var _resources_user_user_resolver_mutations__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./resources/user/user.resolver.mutations */ "./src/resources/user/user.resolver.mutations.js");
/* harmony import */ var _resources_company_company_resolver_mutations__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./resources/company/company.resolver.mutations */ "./src/resources/company/company.resolver.mutations.js");
/* harmony import */ var _resources_organization_organisation_resolver_mutations__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./resources/organization/organisation.resolver.mutations */ "./src/resources/organization/organisation.resolver.mutations.js");
/* harmony import */ var _resources_jobs_jobs_resolver_mutations__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./resources/jobs/jobs.resolver.mutations */ "./src/resources/jobs/jobs.resolver.mutations.js");
/* harmony import */ var _resources_user_user_resolver_query__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./resources/user/user.resolver.query */ "./src/resources/user/user.resolver.query.js");




var _this = undefined;

var _templateObject = babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0___default()(['\n\ttype Query {\n\t\tdummy: String\n\t}\n\ttype Mutation {\n\t\tdummy: String\n\t}\n\ttype Subscription {\n\t\tdummy: String\n\t}\n\tschema {\n\t\tquery: Query\n\t\tmutation: Mutation\n\t\tsubscription: Subscription\n\t}\n'], ['\n\ttype Query {\n\t\tdummy: String\n\t}\n\ttype Mutation {\n\t\tdummy: String\n\t}\n\ttype Subscription {\n\t\tdummy: String\n\t}\n\tschema {\n\t\tquery: Query\n\t\tmutation: Mutation\n\t\tsubscription: Subscription\n\t}\n']);

var _require = __webpack_require__(/*! util */ "util"),
    promisify = _require.promisify;

var Sentry = __webpack_require__(/*! @sentry/node */ "@sentry/node");






/*
LogRocket entry configuration ...
 */
logrocket__WEBPACK_IMPORTED_MODULE_3___default.a.init('oojob/server');
Sentry.configureScope(function (scope) {
	scope.addEventProcessor(function () {
		var _ref = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee(event, hint) {
			return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							event.extra.sessionURL = logrocket__WEBPACK_IMPORTED_MODULE_3___default.a.sessionURL;
							return _context.abrupt('return', event);

						case 2:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, _this);
		}));

		return function (_x, _x2) {
			return _ref.apply(this, arguments);
		};
	}());
});

/*
	import graphql schema
*/








/*
	import graphql resolvers
*/


/*
	import mutations
 */





/*
 import Query functions
 */


var root = Object(apollo_server_express__WEBPACK_IMPORTED_MODULE_4__["gql"])(_templateObject);

var resolvers = Object(lodash__WEBPACK_IMPORTED_MODULE_6__["merge"])({
	Query: {
		dummy: function dummy(obj, args, context, info) {
			return 'Hello World';
		}
	}
},
// All queries and mutations goes here
_resources_user_user_resolver_mutations__WEBPACK_IMPORTED_MODULE_16__["UserMutations"], _resources_company_company_resolver_mutations__WEBPACK_IMPORTED_MODULE_17__["CompanyMutations"], _resources_organization_organisation_resolver_mutations__WEBPACK_IMPORTED_MODULE_18__["OrganizationMutation"], _resources_jobs_jobs_resolver_mutations__WEBPACK_IMPORTED_MODULE_19__["JobMutation"], _resources_user_user_resolver_query__WEBPACK_IMPORTED_MODULE_20__["UserQuery"], _resources_email_email_resolver__WEBPACK_IMPORTED_MODULE_15__["EmailResolvers"]);

var typeDefs = [root, _resources_user_user_graphql__WEBPACK_IMPORTED_MODULE_8__["UserGraphqlSchema"], _resources_applyJob_applyJob_graphql__WEBPACK_IMPORTED_MODULE_9__["ApplyJobGraphqlSchema"], _resources_jobs_jobs_graphql__WEBPACK_IMPORTED_MODULE_10__["JobsGraphqlSchema"], _resources_company_company_graphql__WEBPACK_IMPORTED_MODULE_11__["CompanyGraphqlSchema"], _resources_organization_organization_graphql__WEBPACK_IMPORTED_MODULE_12__["OrganizationGraphqlSchema"], _resources_payment_payment_graphql__WEBPACK_IMPORTED_MODULE_13__["PaymentGraphqlShema"], _resources_email_email_graphql__WEBPACK_IMPORTED_MODULE_14__["EmailGraphqlSchema"]];

/* create a graphql logger */
if (true) {
	var logExecutions = graphql_log__WEBPACK_IMPORTED_MODULE_5___default()({
		prefix: 'resolvers : '
	});
	logExecutions(resolvers);
}

var getAsync = promisify(_db__WEBPACK_IMPORTED_MODULE_7__["redisClient"].get).bind(_db__WEBPACK_IMPORTED_MODULE_7__["redisClient"]);
var GraphQLServer = new apollo_server_express__WEBPACK_IMPORTED_MODULE_4__["ApolloServer"]({
	typeDefs: typeDefs,
	resolvers: resolvers,
	formatError: function formatError(err) {
		Sentry.captureException(err);
		return {
			message: err.message,
			code: err.extensions && err.extensions.code, // <--
			locations: err.locations,
			path: err.path ? err.path : "path not defined"
		};
	},
	context: function context(_ref2) {
		var req = _ref2.req,
		    res = _ref2.res;

		return {
			req: req, mongodb: _db__WEBPACK_IMPORTED_MODULE_7__["mongodb"], redisClient: _db__WEBPACK_IMPORTED_MODULE_7__["redisClient"], sequelize: _db__WEBPACK_IMPORTED_MODULE_7__["sequelize"], getAsync: getAsync, user: req.user
		};
	},
	playground: {
		settings: {
			'editor.theme': 'light'
		}
	},
	// enable playground and introspection in production
	introspection: true,
	tracing: true,
	cacheControl: true,
	engine: false
});

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: port */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "port", function() { return port; });
/* harmony import */ var _config_env_env__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/env/env */ "./config/env/env.js");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! http */ "http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var cluster__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cluster */ "cluster");
/* harmony import */ var cluster__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(cluster__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! os */ "os");
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _server__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./server */ "./src/server.js");
 /* environment variable setup */



 /* create server */
var port = process.env.API_SERVER_PORT || 8080; /* dynamically port configuration */
var numCPUs = os__WEBPACK_IMPORTED_MODULE_3___default.a.cpus().length;

if (cluster__WEBPACK_IMPORTED_MODULE_2___default.a.isMaster) {
	console.log('Master ' + process.pid + ' is running');

	// Fork workers.
	for (var i = 0; i < numCPUs; i++) {
		cluster__WEBPACK_IMPORTED_MODULE_2___default.a.fork();
	}

	cluster__WEBPACK_IMPORTED_MODULE_2___default.a.on('exit', function (worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	});
} else {
	var server = http__WEBPACK_IMPORTED_MODULE_1___default.a.createServer(_server__WEBPACK_IMPORTED_MODULE_4__["default"]);
	var currentApp = _server__WEBPACK_IMPORTED_MODULE_4__["default"];
	_server__WEBPACK_IMPORTED_MODULE_4__["GraphQLEngine"].listen({
		port: port,
		httpServer: server,
		logging: {
			level: "ERROR" // Engine Proxy logging level. DEBUG, INFO (default), WARN or ERROR.
		}
	});
	console.log('Worker ' + process.pid + ' started');
	console.log('\uD83D\uDE80 All Database connected successfully');
	console.log('\uD83D\uDE80 Server ready at http://localhost:' + port + _server__WEBPACK_IMPORTED_MODULE_4__["GraphQLServer"].graphqlPath);

	if (true) {
		module.hot.accept(/*! ./server */ "./src/server.js", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _server__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./server */ "./src/server.js");
(function () {
			server.removeListener('request', currentApp);
			server.on('request', _server__WEBPACK_IMPORTED_MODULE_4__["default"]);
			currentApp = _server__WEBPACK_IMPORTED_MODULE_4__["default"];
		})(__WEBPACK_OUTDATED_DEPENDENCIES__); });
	}
}

/***/ }),

/***/ "./src/middlewares/cors.js":
/*!*********************************!*\
  !*** ./src/middlewares/cors.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cors */ "cors");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_0__);


var corsOption = {
	origin: true,
	methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTION',
	credentials: true,
	exposedHeaders: ['x-auth-token']
};

var corsConfig = function corsConfig(app) {
	app.use(cors__WEBPACK_IMPORTED_MODULE_0___default()(corsOption));
};

/* harmony default export */ __webpack_exports__["default"] = (corsConfig);

/***/ }),

/***/ "./src/middlewares/hosts.js":
/*!**********************************!*\
  !*** ./src/middlewares/hosts.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var host_validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! host-validation */ "host-validation");
/* harmony import */ var host_validation__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(host_validation__WEBPACK_IMPORTED_MODULE_0__);


/* harmony default export */ __webpack_exports__["default"] = (function (app) {
	// allowed hosts
	var hosts = ['http://localhost:8080/graphql', process.env.API_URL, /^(https?:\/\/)\w(:?[0-9]?)*/, /^(https?:\/\/)\w(:?[0-9]?)?\.\w/];

	// allowed referer
	// Express.js middleware that protects Node.js servers from DNS
	// Rebinding attacks by validating Host and Referer [sic] headers from incoming requests.
	app.use(host_validation__WEBPACK_IMPORTED_MODULE_0___default()({
		hosts: hosts
	}));
});

/***/ }),

/***/ "./src/middlewares/ignReq.js":
/*!***********************************!*\
  !*** ./src/middlewares/ignReq.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var ignoreFavicon = function ignoreFavicon(req, res, next) {
	if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
		return res.sendStatus(204);
	} else {
		return next();
	}
};

var ignoreRobots = function ignoreRobots(req, res, next) {
	if (req.url === '/robots.txt') {
		res.type('text/plain');
		res.send('User-agent: *\nDisallow: /');
	} else {
		return next();
	}
};

var ignoreRequest = function ignoreRequest(app) {
	app.use(ignoreFavicon);
	app.use(ignoreRobots);
};

/* harmony default export */ __webpack_exports__["default"] = (ignoreRequest);

/***/ }),

/***/ "./src/middlewares/index.js":
/*!**********************************!*\
  !*** ./src/middlewares/index.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var compression__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! compression */ "compression");
/* harmony import */ var compression__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(compression__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! body-parser */ "body-parser");
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! graphql */ "graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _toobussy__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./toobussy */ "./src/middlewares/toobussy.js");
/* harmony import */ var _security__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./security */ "./src/middlewares/security.js");
/* harmony import */ var _ignReq__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ignReq */ "./src/middlewares/ignReq.js");
/* harmony import */ var _cors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./cors */ "./src/middlewares/cors.js");
/* harmony import */ var _hosts__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./hosts */ "./src/middlewares/hosts.js");
/* harmony import */ var _jwt__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./jwt */ "./src/middlewares/jwt.js");
var Sentry = __webpack_require__(/*! @sentry/node */ "@sentry/node");





/*
Sentry configuration for error tracking ...
 */
Sentry.init({
	dsn: 'https://1730b0d8433a4912a2a01807f48cf908@sentry.io/1278141',
	maxBreadcrumbs: 50,
	debug: true,
	environment: 'staging'
});

/*
	middleware
*/







/* harmony default export */ __webpack_exports__["default"] = (function (app) {
	app.use(Sentry.Handlers.requestHandler()); // The request handler must be the first middleware on the app
	app.use(body_parser__WEBPACK_IMPORTED_MODULE_1___default.a.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
	app.use(body_parser__WEBPACK_IMPORTED_MODULE_1___default.a.json()); // parse application/json
	app.set('trust proxy', true); // run it also behind proxy
	app.use(_toobussy__WEBPACK_IMPORTED_MODULE_4__["default"]);
	Object(_security__WEBPACK_IMPORTED_MODULE_5__["default"])(app);
	Object(_ignReq__WEBPACK_IMPORTED_MODULE_6__["default"])(app);
	Object(_cors__WEBPACK_IMPORTED_MODULE_7__["default"])(app);
	app.use(compression__WEBPACK_IMPORTED_MODULE_0___default()());
	app.use('/graphql', _jwt__WEBPACK_IMPORTED_MODULE_9__["verify"]);
	app.use(Sentry.Handlers.errorHandler()); // The error handler must be before any other error middleware
	app.use(function (err, req, res, next) {
		if (err.name === 'UnauthorizedError') {
			console.log("auth error");
			Sentry.captureException(err);
			next();
		}
		next();
	});
	// hosts(app)
});

/***/ }),

/***/ "./src/middlewares/jwt.js":
/*!********************************!*\
  !*** ./src/middlewares/jwt.js ***!
  \********************************/
/*! exports provided: verify */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "verify", function() { return verify; });
/* harmony import */ var _resources_utils_jwt_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../resources/utils/jwt.auth */ "./src/resources/utils/jwt.auth.js");


var verify = function verify(req, res, next) {
	if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
		console.log(req.headers.authorization.split(" ")[1]);
		var token = req.headers.authorization.split(" ")[1];
		var payload = Object(_resources_utils_jwt_auth__WEBPACK_IMPORTED_MODULE_0__["verifyJwtToken"])(token);
		if (payload !== null || payload !== undefined) {
			req.user = payload;
		}
	} else {
		req.user = {};
	}
	next();
};

/***/ }),

/***/ "./src/middlewares/security.js":
/*!*************************************!*\
  !*** ./src/middlewares/security.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var helmet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! helmet */ "helmet");
/* harmony import */ var helmet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(helmet__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var hpp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! hpp */ "hpp");
/* harmony import */ var hpp__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(hpp__WEBPACK_IMPORTED_MODULE_1__);



/* harmony default export */ __webpack_exports__["default"] = (function (app) {
	// Don't expose any software information to hackers.
	app.disable('x-powered-by');

	// Express middleware to protect against HTTP Parameter Pollution attacks
	app.use(hpp__WEBPACK_IMPORTED_MODULE_1___default()());

	// The X-Frame-Options header tells browsers to prevent your webpage from being put in an iframe.
	app.use(helmet__WEBPACK_IMPORTED_MODULE_0___default.a.frameguard({ action: 'sameorigin' }));

	// Cross-site scripting, abbreviated to “XSS”, is a way attackers can take over webpages.
	app.use(helmet__WEBPACK_IMPORTED_MODULE_0___default.a.xssFilter());

	// Sets the X-Download-Options to prevent Internet Explorer from executing
	// downloads in your site’s context.
	// @see https://helmetjs.github.io/docs/ienoopen/
	app.use(helmet__WEBPACK_IMPORTED_MODULE_0___default.a.ieNoOpen());

	// Don’t Sniff Mimetype middleware, noSniff, helps prevent browsers from trying
	// to guess (“sniff”) the MIME type, which can have security implications. It
	// does this by setting the X-Content-Type-Options header to nosniff.
	// @see https://helmetjs.github.io/docs/dont-sniff-mimetype/
	app.use(helmet__WEBPACK_IMPORTED_MODULE_0___default.a.noSniff());
});

/***/ }),

/***/ "./src/middlewares/toobussy.js":
/*!*************************************!*\
  !*** ./src/middlewares/toobussy.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var toobusy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! toobusy-js */ "toobusy-js");
/* harmony import */ var toobusy_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(toobusy_js__WEBPACK_IMPORTED_MODULE_0__);


var isDevelopment = "development" === 'development' || "development" === 'dev';

/* harmony default export */ __webpack_exports__["default"] = (function (req, res, next) {
	if (!isDevelopment && toobusy_js__WEBPACK_IMPORTED_MODULE_0___default()()) {
		// only show status in production and not in development
		res.statusCode = 503;
		res.send("It looke like ooJob is bussy. Wait few seconds...");
	} else {
		// queue up the request and wait for it to complete in testing and development phase
		next();
	}
});

/***/ }),

/***/ "./src/resources/applyJob/applyJob.graphql.js":
/*!****************************************************!*\
  !*** ./src/resources/applyJob/applyJob.graphql.js ***!
  \****************************************************/
/*! exports provided: ApplyJobGraphqlSchema */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApplyJobGraphqlSchema", function() { return ApplyJobGraphqlSchema; });
var ApplyJobGraphqlSchema = "\n\ttype UsersInApplyJob {\n\t\tuser_id: String!\n\t\tresume: Resume!\n\t\tproposal: String!\n\t\tapplied_on: String!\n\t}\n\ttype ApplyJob {\n\t\tjob_id: String!\n\t\tlikes: Int\n\t\tdislikes: Int\n\t\tusers: [UsersInApplyJob!]\n\t\tvacancy: Int\n\t\tnotification_on_job_apply: Int\n\t}\n\n\textend type Query {\n\t\tfetchApplyJob: ApplyJob\n\t}\n";

/***/ }),

/***/ "./src/resources/company/company.graphql.js":
/*!**************************************************!*\
  !*** ./src/resources/company/company.graphql.js ***!
  \**************************************************/
/*! exports provided: CompanyGraphqlSchema */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompanyGraphqlSchema", function() { return CompanyGraphqlSchema; });
var CompanyGraphqlSchema = "\n  type Review {\n    user_id: String!\n    stars: Int!\n    pros: [String]\n    cons: [String]\n    suggestions: String\n  }\n\tenum TimingsUnits {\n\t\tDD\n\t\tWW\n\t\tMM\n\t\tYY\n\t}\n\ttype TimingsInput {\n\t\tvalue: Int!\n\t\tunits: String!\n\t\tper: TimingsUnits!\n\t}\n  type Timings {\n    fulltime: TimingsInput\n    parttime: TimingsInput\n    internship: TimingsInput\n  }\n  type OpenSource {\n    title: String!\n    description: String!\n    url: String!\n    languages: [String!]\n    licence_type: String!\n  }\n  type Company {\n    id: ID!\n    name: String!\n    desc: String!\n    url: String\n    logo: String\n    location: String\n    reviews: [Review!]\n    timings: Timings\n    compnay_since: String\n    hiring_status: Boolean\n    languages: [String!]\n    no_of_employees: Int\n    opensource: [OpenSource]\n  }\n\tinput CompanyDetails {\n\t\tcreated_by: ID\n\t\tname: String!\n    desc: String!\n    url: String\n    logo: String\n    location: String\n    compnay_since: String\n    hiring_status: Boolean\n    languages: [String!]\n    no_of_employees: Int\n\t}\n  extend type Query {\n    fetchCompany: Company\n  }\n\textend type Mutation {\n\t\tcreateCompany(input: CompanyDetails!): Company\n\t}\n";

/***/ }),

/***/ "./src/resources/company/company.model.js":
/*!************************************************!*\
  !*** ./src/resources/company/company.model.js ***!
  \************************************************/
/*! exports provided: Company */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Company", function() { return Company; });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../db */ "./src/db.js");


var Schema = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema;

var companySchema = new Schema({
	created_by: {
		type: Schema.Types.ObjectId, ref: 'User'
	},
	name: { type: String, unique: true, required: true },
	desc: { type: String, required: true },
	url: { type: String, unique: true, lowercase: true },
	logo: { type: String },
	location: { type: String, default: null },
	reviews: [{
		rev_id: { type: Schema.Types.ObjectId, ref: 'Reviews' }
	}],
	timings: {
		fulltime: { value: { type: Number, default: 8 }, units: { type: String, default: 'HRS' }, per: { type: String, default: 'DD' } },
		parttime: { value: { type: Number, default: 2 }, units: { type: String, default: 'HRS' }, per: { type: String, default: 'DD' } },
		internship: { value: { type: Number, default: 4 }, units: { type: String, default: 'HRS' }, per: { type: String, default: 'DD' } }
	},
	company_since: { type: Date },
	last_seen: { type: Date },
	hiring_status: { type: Boolean, default: false },
	languages: [{ type: String }],
	no_of_employees: { min: { type: Number, default: null }, max: { type: Number, default: null } },
	opensource: [{
		open_source_id: { type: Schema.Types.ObjectId, ref: 'OpenSource' }
	}]
});

var Company = _db__WEBPACK_IMPORTED_MODULE_1__["mongodb"].model('Company', companySchema);

/***/ }),

/***/ "./src/resources/company/company.resolver.mutations.js":
/*!*************************************************************!*\
  !*** ./src/resources/company/company.resolver.mutations.js ***!
  \*************************************************************/
/*! exports provided: CompanyMutations */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompanyMutations", function() { return CompanyMutations; });
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/regenerator */ "babel-runtime/regenerator");
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babel-runtime/helpers/asyncToGenerator */ "babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _company_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./company.model */ "./src/resources/company/company.model.js");
/* harmony import */ var _user_user_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../user/user.model */ "./src/resources/user/user.model.js");



var _this = undefined;





/**
 * @params { companyname }
 * @return { Company }
 * Mutation to create one company
 */
var createCompany = function () {
	var _ref = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(_, _ref2, _ref3) {
		var input = _ref2.input;
		var user = _ref3.user,
		    mongodb = _ref3.mongodb;
		var oldCompany, loggedInUser, company, newCompany;
		return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						if (!(!user || !user.username || user === undefined)) {
							_context.next = 2;
							break;
						}

						throw new apollo_server_express__WEBPACK_IMPORTED_MODULE_2__["AuthenticationError"]('must authenticate');

					case 2:
						if (!(!user.account_type === 'provider')) {
							_context.next = 4;
							break;
						}

						throw new apollo_server_express__WEBPACK_IMPORTED_MODULE_2__["ApolloError"]('Your account must have provider credential rather than seeker', 3);

					case 4:
						_context.next = 6;
						return _company_model__WEBPACK_IMPORTED_MODULE_3__["Company"].findOne({ name: input.name });

					case 6:
						oldCompany = _context.sent;

						if (!oldCompany) {
							_context.next = 9;
							break;
						}

						throw new apollo_server_express__WEBPACK_IMPORTED_MODULE_2__["ApolloError"]("Company already exists", 2);

					case 9:
						_context.next = 11;
						return _user_user_model__WEBPACK_IMPORTED_MODULE_4__["User"].findById(user.id);

					case 11:
						loggedInUser = _context.sent;

						// now create the new company
						company = new _company_model__WEBPACK_IMPORTED_MODULE_3__["Company"](input);

						company.created_by = user.id;
						_context.next = 16;
						return company.save();

					case 16:
						newCompany = _context.sent;

						loggedInUser.ownedCompany.push({
							comp_id: newCompany.id
						});
						_context.next = 20;
						return loggedInUser.save();

					case 20:
						return _context.abrupt('return', newCompany);

					case 21:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this);
	}));

	return function createCompany(_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
}();

var CompanyMutations = {
	Mutation: {
		createCompany: createCompany
	}
};

/***/ }),

/***/ "./src/resources/email/email.graphql.js":
/*!**********************************************!*\
  !*** ./src/resources/email/email.graphql.js ***!
  \**********************************************/
/*! exports provided: EmailGraphqlSchema */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmailGraphqlSchema", function() { return EmailGraphqlSchema; });
var EmailGraphqlSchema = "\n\ttype Email {\n\t\tid: ID!\n\t\tto: String!\n\t\tfrom: String!\n\t\tsubject: String!\n\t\ttext: String!\n\t}\n\tinput ClientEmail {\n\t\tto: String!\n\t\tfrom: String!\n\t\tsubject: String!\n\t\ttext: String!\n\t}\n\tinput emailCred {\n\t\tusername: String!\n\t\temail: ClientEmail\n\t}\n\textend type Query {\n\t\tallEmails: [Email]!\n\t\tuserEmails: [Email]!\n\t\tsingleEmail: Email!\n\t}\n\textend type Mutation {\n\t\tsendMail(input: emailCred): Boolean!\n\t}\n";

/***/ }),

/***/ "./src/resources/email/email.resolver.js":
/*!***********************************************!*\
  !*** ./src/resources/email/email.resolver.js ***!
  \***********************************************/
/*! exports provided: EmailResolvers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmailResolvers", function() { return EmailResolvers; });
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/regenerator */ "babel-runtime/regenerator");
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babel-runtime/helpers/asyncToGenerator */ "babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _sendgrid_mail__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sendgrid/mail */ "@sendgrid/mail");
/* harmony import */ var _sendgrid_mail__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_sendgrid_mail__WEBPACK_IMPORTED_MODULE_2__);



var _this = undefined;


_sendgrid_mail__WEBPACK_IMPORTED_MODULE_2___default.a.setApiKey(process.env.SENDGRID_API_KEY);

var sendMail = function () {
	var _ref = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(_, _ref2, _ref3) {
		var input = _ref2.input;
		var user = _ref3.user;
		var msg, mailData;
		return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						if (user) {
							_context.next = 2;
							break;
						}

						throw new Error("You must be logged in");

					case 2:
						msg = {
							to: input.email.to,
							from: input.email.from,
							subject: input.email.subject,
							text: input.email.text
						};
						_context.next = 5;
						return _sendgrid_mail__WEBPACK_IMPORTED_MODULE_2___default.a.send(msg);

					case 5:
						mailData = _context.sent;

						if (mailData) {
							_context.next = 8;
							break;
						}

						throw new Error("Error sending email");

					case 8:
						return _context.abrupt("return", true);

					case 9:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, _this);
	}));

	return function sendMail(_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
}();

var EmailResolvers = {
	Mutation: {
		sendMail: sendMail
	}
};

/***/ }),

/***/ "./src/resources/jobs/jobs.graphql.js":
/*!********************************************!*\
  !*** ./src/resources/jobs/jobs.graphql.js ***!
  \********************************************/
/*! exports provided: JobsGraphqlSchema */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JobsGraphqlSchema", function() { return JobsGraphqlSchema; });
var JobsGraphqlSchema = "\n  enum CurrentStatus {\n    active\n    hold\n    expired\n    closed\n    urgent\n  }\n  type Resume {\n    path: String!\n    user_id: String!\n  }\n  type Job {\n    id: String!\n    name: String!\n    type: String!\n    category: [String!]\n    desc: String!\n    skills_required: [String!]\n    sallary_min: Float!\n    sallary_max: Float!\n    location: String\n    attachment: String\n    resume: Resume\n    current_status: CurrentStatus!\n    views: Int\n\t\tcreated_by: String\n\t\tcompany: String\n\t\torganization: String\n\t\tprofile: String\n    applyJob: [ApplyJob!]\n  }\n  extend type Query {\n    fetchJob: Job\n  }\n\tinput createJobInput {\n\t\tname: String!\n\t\ttype: String!\n\t\tdesc: String!\n\t\tskills_required: [String]\n\t\tsallary_min: Float!\n\t\tsallary_max: Float!\n\t\tlocation: String\n\t\tprofile: String\n\t\tcompany: String\n\t}\n\textend type Mutation {\n\t\tjobCreate(input: createJobInput!): Job!\n\t}\n";

/***/ }),

/***/ "./src/resources/jobs/jobs.model.js":
/*!******************************************!*\
  !*** ./src/resources/jobs/jobs.model.js ***!
  \******************************************/
/*! exports provided: Jobs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Jobs", function() { return Jobs; });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../db */ "./src/db.js");


var Schema = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema;

var jobSchema = new Schema({
	name: { type: String, required: true },
	type: { type: String, required: true },
	desc: { type: String, required: true },
	skills_required: [{ type: String }],
	sallary_min: { value: { type: Number }, currency: { type: String } },
	sallary_max: { value: { type: Number }, currency: { type: String } },
	location: { type: String },
	attachment: [{ "type": { type: String }, file: { type: String } }],
	resume: { path: { type: String }, user_id: { type: Schema.Types.ObjectId, ref: 'User' } },
	current_status: { type: String, lowercase: true },
	views: { type: Number, default: 0 },
	applyJob: [{
		type: Schema.Types.ObjectId,
		ref: 'ApplyJob'
	}],
	created_by: { type: Schema.Types.ObjectId, ref: 'User' },
	company: { type: Schema.Types.ObjectId, ref: 'Company' },
	organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
	profile: { type: String, default: 'company' }
});

var Jobs = _db__WEBPACK_IMPORTED_MODULE_1__["mongodb"].model('Jobs', jobSchema);

/*
	milestone: [
		{
			key: {
				type: Number
			},
			value: {
				type: String
			}
		}
	],
*/

/***/ }),

/***/ "./src/resources/jobs/jobs.resolver.mutations.js":
/*!*******************************************************!*\
  !*** ./src/resources/jobs/jobs.resolver.mutations.js ***!
  \*******************************************************/
/*! exports provided: jobCreate, JobMutation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "jobCreate", function() { return jobCreate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JobMutation", function() { return JobMutation; });
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/regenerator */ "babel-runtime/regenerator");
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babel-runtime/helpers/defineProperty */ "babel-runtime/helpers/defineProperty");
/* harmony import */ var babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! babel-runtime/helpers/asyncToGenerator */ "babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _jobs_graphql__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./jobs.graphql */ "./src/resources/jobs/jobs.graphql.js");
/* harmony import */ var _jobs_model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./jobs.model */ "./src/resources/jobs/jobs.model.js");
/* harmony import */ var _user_user_model__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../user/user.model */ "./src/resources/user/user.model.js");




var _this = undefined;






var jobCreate = function () {
	var _ref = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(_, _ref2, _ref3) {
		var input = _ref2.input;
		var mongodb = _ref3.mongodb,
		    user = _ref3.user;
		var currentUser, job, checkJob, savedJob;
		return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						if (user.username) {
							_context.next = 2;
							break;
						}

						throw new apollo_server_express__WEBPACK_IMPORTED_MODULE_3__["AuthenticationError"]("must authenticate");

					case 2:
						if (!(user.account_type !== 'provider')) {
							_context.next = 4;
							break;
						}

						throw new apollo_server_express__WEBPACK_IMPORTED_MODULE_3__["ApolloError"]('Your account must have provider credential rather than seeker', 3);

					case 4:
						_context.next = 6;
						return _user_user_model__WEBPACK_IMPORTED_MODULE_6__["User"].findById(user.id);

					case 6:
						currentUser = _context.sent;
						job = new _jobs_model__WEBPACK_IMPORTED_MODULE_5__["Jobs"](babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()({
							name: input.name,
							type: input.type,
							desc: input.desc,
							skills_required: input.skills_required ? input.skills_required : null,
							sallary_min: input.sallary_min ? input.sallary_min : null,
							sallary_max: input.sallary_max ? input.sallary_max : null,
							location: input.location ? input.location : null,
							created_by: user.id,
							profile: input.profile
						}, input.profile, currentUser.organization));
						checkJob = currentUser.jobs.find(function (job) {
							if (job.name === input.name) {
								throw new apollo_server_express__WEBPACK_IMPORTED_MODULE_3__["ApolloError"]("Job already exists for this organization", 2);
							}
						});
						_context.next = 11;
						return job.save();

					case 11:
						savedJob = _context.sent;

						currentUser.jobs.push({
							job_id: savedJob.id,
							status: 'active'
						});
						return _context.abrupt('return', savedJob);

					case 14:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this);
	}));

	return function jobCreate(_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
}();

var JobMutation = {
	Mutation: {
		jobCreate: jobCreate
	}
};

/***/ }),

/***/ "./src/resources/organization/organisation.resolver.mutations.js":
/*!***********************************************************************!*\
  !*** ./src/resources/organization/organisation.resolver.mutations.js ***!
  \***********************************************************************/
/*! exports provided: OrganizationMutation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrganizationMutation", function() { return OrganizationMutation; });
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/regenerator */ "babel-runtime/regenerator");
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babel-runtime/helpers/asyncToGenerator */ "babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _organization_model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./organization.model */ "./src/resources/organization/organization.model.js");
/* harmony import */ var _user_user_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../user/user.model */ "./src/resources/user/user.model.js");



var _this = undefined;





var createOrganisation = function () {
	var _ref = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(_, _ref2, _ref3) {
		var input = _ref2.input;
		var user = _ref3.user;
		var oldCompany, loggedInUser, organization, newOrganization;
		return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						if (!(!user || !user.username || user === undefined)) {
							_context.next = 2;
							break;
						}

						throw new apollo_server_express__WEBPACK_IMPORTED_MODULE_2__["AuthenticationError"]('must authenticate');

					case 2:
						if (!(user.account_type !== 'provider')) {
							_context.next = 4;
							break;
						}

						throw new apollo_server_express__WEBPACK_IMPORTED_MODULE_2__["ApolloError"]('Your account must have provider credential rather than seeker', 3);

					case 4:
						_context.next = 6;
						return _organization_model__WEBPACK_IMPORTED_MODULE_3__["Organization"].findOne({ name: input.name });

					case 6:
						oldCompany = _context.sent;

						if (!oldCompany) {
							_context.next = 9;
							break;
						}

						throw new apollo_server_express__WEBPACK_IMPORTED_MODULE_2__["ApolloError"]("Organization already exists", 2);

					case 9:
						_context.next = 11;
						return _user_user_model__WEBPACK_IMPORTED_MODULE_4__["User"].findById(user.id);

					case 11:
						loggedInUser = _context.sent;
						organization = new _organization_model__WEBPACK_IMPORTED_MODULE_3__["Organization"](input);

						organization.created_by = user.id;
						_context.next = 16;
						return organization.save();

					case 16:
						newOrganization = _context.sent;

						loggedInUser.ownedOrganization.push({
							org_id: newOrganization.id
						});
						loggedInUser.organization = newOrganization.id;
						_context.next = 21;
						return loggedInUser.save();

					case 21:
						return _context.abrupt('return', newOrganization);

					case 22:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this);
	}));

	return function createOrganisation(_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
}();

var OrganizationMutation = {
	Mutation: {
		createOrganisation: createOrganisation
	}
};

/***/ }),

/***/ "./src/resources/organization/organization.graphql.js":
/*!************************************************************!*\
  !*** ./src/resources/organization/organization.graphql.js ***!
  \************************************************************/
/*! exports provided: OrganizationGraphqlSchema */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrganizationGraphqlSchema", function() { return OrganizationGraphqlSchema; });
var OrganizationGraphqlSchema = "\n\ttype Organization {\n\t\tid: String!\n\t\tname: String!\n\t\tdesc: String!\n\t\turl: String\n\t\taddress: String\n\t\tphoneno: String\n\t\torg_type: [String!]\n\t\torganization_since: String\n\t\tno_of_member: Int\n\t\tlogo: String\n\t\tlanguages: [String!]\n\t\treviews: [Review]\n\t\tcreated_at: String!\n\t\tupdated_at: String!\n\t\thiring_status: Boolean\n\t\tno_of_employees: Int\n\t\topensource: [OpenSource]\n\t\tlocation: String\n\t\tcreated_by: User!\n\t}\n\tinput OrganizationDetails {\n\t\tcreated_by: ID\n\t\tname: String!\n    desc: String!\n    url: String\n    logo: String\n    location: String\n    organization_since: String\n    hiring_status: Boolean\n    languages: [String!]\n    no_of_employees: Int\n\t}\n  extend type Query {\n    fetchOrganization: Organization\n  }\n\textend type Mutation {\n\t\tcreateOrganisation(input: OrganizationDetails!): Organization\n\t}\n";

/***/ }),

/***/ "./src/resources/organization/organization.model.js":
/*!**********************************************************!*\
  !*** ./src/resources/organization/organization.model.js ***!
  \**********************************************************/
/*! exports provided: Organization */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Organization", function() { return Organization; });
/* harmony import */ var babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/helpers/defineProperty */ "babel-runtime/helpers/defineProperty");
/* harmony import */ var babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../db */ "./src/db.js");


var _ref;



var Schema = mongoose__WEBPACK_IMPORTED_MODULE_1___default.a.Schema;

var OrganizationSchema = new Schema((_ref = {
	created_by: {
		type: Schema.Types.ObjectId, ref: 'User'
	},
	name: { type: String, unique: true, required: true },
	desc: { type: String, required: true },
	url: { type: String, lowercase: true },
	address: { type: String },
	phoneno: { type: String },
	org_type: [{ type: String }],
	organization_since: { type: Date },
	last_seen: { type: Date },
	no_of_employees: { min: Number, max: Number },
	logo: { type: String },
	languages: [{ type: String }],
	location: { type: String },
	reviews: [{
		rev_id: { type: Schema.Types.ObjectId, ref: 'Reviews' }
	}]
}, babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_ref, 'no_of_employees', { min: { type: Number, default: null }, max: { type: Number, default: null } }), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_ref, 'hiring_status', { type: Boolean, default: false }), babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_ref, 'opensource', [{
	open_source_id: { type: Schema.Types.ObjectId, ref: 'OpenSource' }
}]), _ref), { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

OrganizationSchema.pre('find', function () {
	this.populate('created_by');
});

var Organization = _db__WEBPACK_IMPORTED_MODULE_2__["mongodb"].model('Organization', OrganizationSchema);

/***/ }),

/***/ "./src/resources/payment/payment.graphql.js":
/*!**************************************************!*\
  !*** ./src/resources/payment/payment.graphql.js ***!
  \**************************************************/
/*! exports provided: PaymentGraphqlShema */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PaymentGraphqlShema", function() { return PaymentGraphqlShema; });
var PaymentGraphqlShema = "\n  extend type Query {\n    fetchPayment: String\n  }\n";

/***/ }),

/***/ "./src/resources/user/user.graphql.js":
/*!********************************************!*\
  !*** ./src/resources/user/user.graphql.js ***!
  \********************************************/
/*! exports provided: UserGraphqlSchema */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserGraphqlSchema", function() { return UserGraphqlSchema; });
var UserGraphqlSchema = "\n\ttype SocialUrls {\n\t\tfacebook: String\n\t\tgoogle: String\n\t\ttwitter: String\n\t\tgithub: String\n\t\tinstagram: String\n\t\tpersonal: String\n\t}\n\ttype Status {\n\t\tstatus: Boolean!\n\t}\n\ttype Notification {\n\t\tjob_posting: Status!\n\t\tcompany_promotion: Status!\n\t\tmessage: Status!\n\t\tmail: Status!\n\t\tcomment: Status!\n\t}\n\tenum SubscriptionTypeEnum {\n\t\tfree\n\t\tstarter\n\t\tpremium\n\t}\n\tenum AccountTypeEnum {\n\t\tprovider\n\t\tseeker\n\t}\n\ttype Account {\n\t\taccount_type: AccountTypeEnum!\n\t\tsubscription_type: SubscriptionTypeEnum!\n\t}\n\ttype User {\n\t\tid: ID!\n\t\tusername: String!\n\t\temail: String!\n\t\tphone: String\n\t\taddress: String\n\t\tlocation: String\n\t\tprofile_picture: String\n\t\tverified: Boolean!\n\t\tcreated_at: String!\n\t\tupdated_at: String!\n\t\torganization: Organization\n\t\tsocial_urls: SocialUrls!\n\t\tnotification: Notification!\n\t\taccount: Account!\n\t}\n\ttype UserResult {\n\t\tstatus: Boolean!\n\t\tmessage: String!\n\t\tuser: User\n\t}\n\ttype Result {\n\t\tstatus: Boolean!\n\t\tmessage: String!\n\t}\n\ttype PasswordReset {\n\t\ttoken: String\n\t\tconfirm: Boolean\n\t}\n\textend type Query {\n\t\tcurrentUser: User\n\t\tgetMe: String\n\t\tcheckEmail(email: String!): Result!\n\t\tcheckUser(username: String!): Result!\n\t\tgetAllUser: [User]!\n\t\tgetUser(id: ID!): User\n\t\tnotification(id: ID!): Notification\n\t}\n\tinput AccountTypeInput {\n\t\taccount_type: AccountTypeEnum!\n\t\tsubscription_type: SubscriptionTypeEnum\n\t}\n\tinput UserSignupCredInput {\n\t\tusername: String!\n\t\temail: String!\n\t\tpassword: String!\n\t\taccount: AccountTypeInput!\n\t}\n\tinput UserLoginCredInput {\n\t\tusername: String\n\t\temail: String\n\t\tpassword: String!\n\t}\n\tinput UserCheckInput {\n\t\temail: String\n\t\tusername: String\n\t}\n\tinput TokenInput {\n\t\ttoken: String!\n\t\temail: String\n\t\tusername: String\n\t}\n\tinput ResetPasswordInput {\n\t\ttoken: String!\n\t\temail: String\n\t\tusername: String\n\t\tpassword: String!\n\t\tagainPassword: String!\n\t}\n\textend type Mutation {\n\t\tsignup(input: UserSignupCredInput!): UserResult!\n\t\tlogin(input: UserLoginCredInput!): Result!\n\t\tpasswordToken(input: UserCheckInput!): Result!\n\t\tconfirmToken(input: TokenInput!): Result!\n\t\tresetPassword(input: ResetPasswordInput!): Result!\n\t\tchangeUsername(input: UserCheckInput!): Result!\n\t}\n";

/***/ }),

/***/ "./src/resources/user/user.model.js":
/*!******************************************!*\
  !*** ./src/resources/user/user.model.js ***!
  \******************************************/
/*! exports provided: User */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
/* harmony import */ var babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/helpers/defineProperty */ "babel-runtime/helpers/defineProperty");
/* harmony import */ var babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../db */ "./src/db.js");




var Schema = mongoose__WEBPACK_IMPORTED_MODULE_2___default.a.Schema;

var userSchema = new Schema({
	username: { type: String, unique: true, required: true },
	email: { type: String, unique: true, required: true },
	password: babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()({ required: true, type: String }, 'required', true),
	phone: { type: String },
	address: { type: String },
	location: { type: String },
	profile_picture: { type: String },
	verified: { type: Boolean, default: false },
	social_urls: {
		facebook: { type: String, default: null },
		google: { type: String, default: null },
		twitter: { type: String, default: null },
		github: { type: String, default: null },
		instagram: { type: String, default: null },
		personal: { type: String, default: null }
	},
	notification: {
		job_posting: { status: { type: Boolean, default: true } },
		company_promotion: { status: { type: Boolean, default: true } },
		comment: { status: { type: Boolean, default: true } },
		mail: { status: { type: Boolean, default: true } },
		message: { status: { type: Boolean, default: true } }
	},
	account: {
		account_type: { type: String, lowercase: true },
		subscription_type: { type: String, lowercase: true, default: 'free' }
	},
	ownedCompany: [{
		comp_id: { type: Schema.Types.ObjectId, ref: 'Company' }
	}],
	ownedOrganization: [{
		org_id: { type: Schema.Types.ObjectId, ref: 'Organization' }
	}],
	companyWorking: [{
		comp_id: { type: Schema.Types.ObjectId, ref: 'Company' }
	}],
	applyJob: [{
		apply_job_id: { type: Schema.Types.ObjectId, ref: 'ApplyJob' }
	}],
	jobs: [{
		job_id: { type: Schema.Types.ObjectId, ref: 'Jobs' },
		status: { type: String, lowercase: true }
	}],
	organization: { type: Schema.Types.ObjectId, ref: 'Organization' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

userSchema.statics.sendUser = function (user) {
	user.password = "**********************************";
	return user;
};

/*
	Method's to encrypt and decrypt the password
	@params {password}
	@return {hashed password}
*/
userSchema.methods.hashPassword = function () {
	var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 64;

	var salt = new Buffer(new String(process.env.HASH_SECRET), 'base64');
	var key = crypto__WEBPACK_IMPORTED_MODULE_1___default.a.pbkdf2Sync(this.password, salt, 100000, length, 'sha512');
	this.password = key.toString('hex');
	console.log(this.password);
	return true;
};

userSchema.methods.verifyPassword = function (password) {
	var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 64;

	var salt = new Buffer(new String(process.env.HASH_SECRET), 'base64');
	var key = crypto__WEBPACK_IMPORTED_MODULE_1___default.a.pbkdf2Sync(password, salt, 100000, length, 'sha512');
	console.log(key);
	console.log(this.password);
	if (this.password === key.toString('hex')) {
		return true;
	}
	return false;
};

var User = _db__WEBPACK_IMPORTED_MODULE_3__["mongodb"].model('User', userSchema);

/***/ }),

/***/ "./src/resources/user/user.resolver.mutations.js":
/*!*******************************************************!*\
  !*** ./src/resources/user/user.resolver.mutations.js ***!
  \*******************************************************/
/*! exports provided: UserMutations */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserMutations", function() { return UserMutations; });
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/regenerator */ "babel-runtime/regenerator");
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babel-runtime/helpers/asyncToGenerator */ "babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var redis__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! redis */ "redis");
/* harmony import */ var redis__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(redis__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _user_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./user.model */ "./src/resources/user/user.model.js");
/* harmony import */ var _utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/resuleGenerate */ "./src/resources/utils/resuleGenerate.js");
/* harmony import */ var _utils_resultUser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/resultUser */ "./src/resources/utils/resultUser.js");
/* harmony import */ var _utils_jwt_auth__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/jwt.auth */ "./src/resources/utils/jwt.auth.js");
/* harmony import */ var _utils_tokenGenerate__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/tokenGenerate */ "./src/resources/utils/tokenGenerate.js");



var _this = undefined;









/**
 * @params { email, username, password }
 * @return { success, message }
 * Mutation to create user
 */
var signup = function () {
	var _ref = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(_, _ref2, _ref3) {
		var input = _ref2.input;
		var mongodb = _ref3.mongodb;
		var oldUser, user, newUser;
		return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return _user_model__WEBPACK_IMPORTED_MODULE_4__["User"].findOne({ $or: [{ email: input.email }, { username: input.username }] });

					case 2:
						oldUser = _context.sent;

						if (!oldUser) {
							_context.next = 5;
							break;
						}

						return _context.abrupt("return", Object(_utils_resultUser__WEBPACK_IMPORTED_MODULE_6__["generateUser"])(false, "Email or Username is already taken"));

					case 5:
						user = new _user_model__WEBPACK_IMPORTED_MODULE_4__["User"](input);

						user.hashPassword();
						_context.next = 9;
						return user.save();

					case 9:
						newUser = _context.sent;
						return _context.abrupt("return", Object(_utils_resultUser__WEBPACK_IMPORTED_MODULE_6__["generateUser"])(true, "successfully created user", newUser));

					case 11:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, _this);
	}));

	return function signup(_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
}();

/**
 * @params { username, password }
 * @return { success, message }
 * Mutation to login user
 */
var login = function () {
	var _ref4 = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(_, _ref5) {
		var input = _ref5.input;
		var user, verified, payload, token;
		return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return _user_model__WEBPACK_IMPORTED_MODULE_4__["User"].findOne({ $or: [{ email: input.email }, { username: input.username }] });

					case 2:
						user = _context2.sent;

						if (user) {
							_context2.next = 5;
							break;
						}

						return _context2.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "No user exist with this username or email address"));

					case 5:
						verified = user.verifyPassword(input.password);

						if (verified) {
							_context2.next = 8;
							break;
						}

						return _context2.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "Password Wrong."));

					case 8:
						payload = { id: user.id, email: user.email, username: user.username, account_type: user.account.account_type };
						token = "Bearer " + Object(_utils_jwt_auth__WEBPACK_IMPORTED_MODULE_7__["generateJwtToken"])(payload);
						return _context2.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(true, token));

					case 11:
					case "end":
						return _context2.stop();
				}
			}
		}, _callee2, _this);
	}));

	return function login(_x4, _x5) {
		return _ref4.apply(this, arguments);
	};
}();

/**
 * @params { email, username }
 * @return { success, message }
 * Mutation to create password reset token
 */
var passwordToken = function () {
	var _ref6 = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(_, _ref7, _ref8) {
		var input = _ref7.input;
		var redisClient = _ref8.redisClient;
		var email, username, user, token;
		return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						email = input.email ? input.email : '';
						username = input.username ? input.username : '';
						_context3.next = 4;
						return _user_model__WEBPACK_IMPORTED_MODULE_4__["User"].findOne({ $or: [{ email: email }, { username: username }] });

					case 4:
						user = _context3.sent;

						if (user) {
							_context3.next = 12;
							break;
						}

						if (!(email === '' && username === '')) {
							_context3.next = 8;
							break;
						}

						return _context3.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "Please pass email or username"));

					case 8:
						if (!(email !== '')) {
							_context3.next = 10;
							break;
						}

						return _context3.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "no user exist for this " + email));

					case 10:
						if (!(username !== '')) {
							_context3.next = 12;
							break;
						}

						return _context3.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "no user exist for this " + username));

					case 12:
						token = Object(_utils_tokenGenerate__WEBPACK_IMPORTED_MODULE_8__["generateToken"])(50);

						if (email !== '') {
							redisClient.set(email + "-password-reset", token, redis__WEBPACK_IMPORTED_MODULE_3___default.a.print);
						}
						if (username !== '') {
							redisClient.set(username + "-password-reset", token, redis__WEBPACK_IMPORTED_MODULE_3___default.a.print);
						}
						return _context3.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(true, token));

					case 16:
					case "end":
						return _context3.stop();
				}
			}
		}, _callee3, _this);
	}));

	return function passwordToken(_x6, _x7, _x8) {
		return _ref6.apply(this, arguments);
	};
}();

/**
 * @params { token, username, email }
 * @return { success, message }
 * Mutation to confirm password reset token and generate token for updating password
 */
var confirmToken = function () {
	var _ref9 = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(_, _ref10, _ref11) {
		var input = _ref10.input;
		var redisClient = _ref11.redisClient,
		    getAsync = _ref11.getAsync;
		var token, email, username, key, isKey, user, data, newToken;
		return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						token = input.token;
						email = input.email ? input.email : '';
						username = input.username ? input.username : '';
						key = null;

						if (email !== '') {
							key = email + "-password-reset";
						}
						if (username !== '') {
							key = username + "-password-reset";
						}

						if (!(key !== null)) {
							_context4.next = 10;
							break;
						}

						isKey = redisClient.get(key, redis__WEBPACK_IMPORTED_MODULE_3___default.a.print);

						if (isKey) {
							_context4.next = 10;
							break;
						}

						return _context4.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "no value for provider key"));

					case 10:
						_context4.next = 12;
						return _user_model__WEBPACK_IMPORTED_MODULE_4__["User"].findOne({ $or: [{ email: email }, { username: username }] });

					case 12:
						user = _context4.sent;

						if (user) {
							_context4.next = 20;
							break;
						}

						if (!(email === '' && username === '')) {
							_context4.next = 16;
							break;
						}

						return _context4.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "Please pass email or username"));

					case 16:
						if (!(email !== '')) {
							_context4.next = 18;
							break;
						}

						return _context4.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "no user exist for this " + email));

					case 18:
						if (!(username !== '')) {
							_context4.next = 20;
							break;
						}

						return _context4.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "no user exist for this " + email));

					case 20:
						_context4.next = 22;
						return getAsync(key);

					case 22:
						data = _context4.sent;

						if (!(data !== token || data === null)) {
							_context4.next = 25;
							break;
						}

						return _context4.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "Please pass valid token"));

					case 25:
						// data is equal to token
						redisClient.del(key);
						newToken = Object(_utils_tokenGenerate__WEBPACK_IMPORTED_MODULE_8__["generateToken"])(50);

						if (email !== '') {
							redisClient.set(email + "-password-token", newToken, redis__WEBPACK_IMPORTED_MODULE_3___default.a.print);
						}
						if (username !== '') {
							redisClient.set(username + "-password-token", newToken, redis__WEBPACK_IMPORTED_MODULE_3___default.a.print);
						}
						return _context4.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(true, newToken));

					case 30:
					case "end":
						return _context4.stop();
				}
			}
		}, _callee4, _this);
	}));

	return function confirmToken(_x9, _x10, _x11) {
		return _ref9.apply(this, arguments);
	};
}();

/**
 * @params { token, againPassword, password }
 * @return { success, message }
 * Mutation to confirm reset password with token
 */
var resetPassword = function () {
	var _ref12 = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5(_, _ref13, _ref14) {
		var input = _ref13.input;
		var redisClient = _ref14.redisClient,
		    getAsync = _ref14.getAsync;
		var email, username, token, key, user, data;
		return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						email = input.email ? input.email : '';
						username = input.username ? input.username : '';
						token = input.token;
						key = null;

						if (email !== '') {
							key = email + "-password-token";
						}
						if (username !== '') {
							key = username + "-password-token";
						}
						_context5.next = 8;
						return _user_model__WEBPACK_IMPORTED_MODULE_4__["User"].findOne({ $or: [{ email: email }, { username: username }] });

					case 8:
						user = _context5.sent;

						if (user) {
							_context5.next = 16;
							break;
						}

						if (!(email === '' && username === '')) {
							_context5.next = 12;
							break;
						}

						return _context5.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "Please pass email or username"));

					case 12:
						if (!(email !== '')) {
							_context5.next = 14;
							break;
						}

						return _context5.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "no user exist for this " + email));

					case 14:
						if (!(username !== '')) {
							_context5.next = 16;
							break;
						}

						return _context5.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "no user exist for this " + username));

					case 16:
						_context5.next = 18;
						return getAsync(key);

					case 18:
						data = _context5.sent;

						if (!(data !== token || data === null)) {
							_context5.next = 21;
							break;
						}

						return _context5.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "Please pass valid token"));

					case 21:
						if (!(input.password !== input.againPassword)) {
							_context5.next = 23;
							break;
						}

						return _context5.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "Wrong password match."));

					case 23:
						user.password = input.password;
						user.hashPassword();
						_context5.next = 27;
						return user.save();

					case 27:
						redisClient.del(key);
						return _context5.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(true, "Successfully updated the password"));

					case 29:
					case "end":
						return _context5.stop();
				}
			}
		}, _callee5, _this);
	}));

	return function resetPassword(_x12, _x13, _x14) {
		return _ref12.apply(this, arguments);
	};
}();

/**
 * @params { email, username }
 * @return { success, message }
 * Mutation to create username or email (unique across the database)
 */
var changeUsername = function () {
	var _ref15 = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee6(_, _ref16, _ref17) {
		var input = _ref16.input;
		var redisClient = _ref17.redisClient,
		    getAsync = _ref17.getAsync,
		    user = _ref17.user;

		var email, username, returnUser, sameUserReturn, _sameUserReturn;

		return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						if (user.username) {
							_context6.next = 2;
							break;
						}

						throw new apollo_server_express__WEBPACK_IMPORTED_MODULE_2__["AuthenticationError"]('must authenticate');

					case 2:
						email = input.email ? input.email : '';
						username = input.username ? input.username : '';

						if (!(email === '' && username === '')) {
							_context6.next = 6;
							break;
						}

						return _context6.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "Please pass email or username"));

					case 6:
						_context6.next = 8;
						return _user_model__WEBPACK_IMPORTED_MODULE_4__["User"].findOne({ $or: [{ email: email }, { username: username }] });

					case 8:
						returnUser = _context6.sent;

						if (!returnUser) {
							_context6.next = 18;
							break;
						}

						if (!(email !== '')) {
							_context6.next = 14;
							break;
						}

						if (!(user.email === returnUser.email)) {
							_context6.next = 13;
							break;
						}

						return _context6.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(true, "You updated your own email"));

					case 13:
						return _context6.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "user exist for this " + email));

					case 14:
						if (!(username !== '')) {
							_context6.next = 18;
							break;
						}

						if (!(user.username === returnUser.username)) {
							_context6.next = 17;
							break;
						}

						return _context6.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(true, "You updated your own username"));

					case 17:
						return _context6.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(false, "user exist for this " + username));

					case 18:
						if (!(username !== '')) {
							_context6.next = 25;
							break;
						}

						_context6.next = 21;
						return _user_model__WEBPACK_IMPORTED_MODULE_4__["User"].findOne({ email: user.email });

					case 21:
						sameUserReturn = _context6.sent;

						sameUserReturn.username = username;
						_context6.next = 25;
						return sameUserReturn.save();

					case 25:
						if (!(email !== '')) {
							_context6.next = 32;
							break;
						}

						_context6.next = 28;
						return _user_model__WEBPACK_IMPORTED_MODULE_4__["User"].findOne({ username: user.username });

					case 28:
						_sameUserReturn = _context6.sent;

						_sameUserReturn.email = email;
						_context6.next = 32;
						return _sameUserReturn.save();

					case 32:
						return _context6.abrupt("return", Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_5__["generateResult"])(true, "Successfully updated"));

					case 33:
					case "end":
						return _context6.stop();
				}
			}
		}, _callee6, _this);
	}));

	return function changeUsername(_x15, _x16, _x17) {
		return _ref15.apply(this, arguments);
	};
}();

var UserMutations = {
	Mutation: {
		signup: signup,
		login: login,
		passwordToken: passwordToken,
		confirmToken: confirmToken,
		resetPassword: resetPassword,
		changeUsername: changeUsername
	}
};

/***/ }),

/***/ "./src/resources/user/user.resolver.query.js":
/*!***************************************************!*\
  !*** ./src/resources/user/user.resolver.query.js ***!
  \***************************************************/
/*! exports provided: UserQuery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserQuery", function() { return UserQuery; });
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/regenerator */ "babel-runtime/regenerator");
/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babel-runtime/helpers/asyncToGenerator */ "babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var redis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! redis */ "redis");
/* harmony import */ var redis__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(redis__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _user_model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./user.model */ "./src/resources/user/user.model.js");
/* harmony import */ var _organization_organization_model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../organization/organization.model */ "./src/resources/organization/organization.model.js");
/* harmony import */ var _utils_tokenGenerate__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/tokenGenerate */ "./src/resources/utils/tokenGenerate.js");
/* harmony import */ var _utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/resuleGenerate */ "./src/resources/utils/resuleGenerate.js");
/* harmony import */ var _utils_helper__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/helper */ "./src/resources/utils/helper.js");



var _this = undefined;






/* Util method's here */




/**
 * Below are the Query Functions
 */

/**
 * @params { email }
 * @return { success, message }
 * Query to check email exists's or not
 */
var checkEmail = function () {
	var _ref = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(_, _ref2) {
		var email = _ref2.email;
		var user;
		return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return _user_model__WEBPACK_IMPORTED_MODULE_4__["User"].findOne({ email: email });

					case 2:
						user = _context.sent;

						if (user) {
							_context.next = 5;
							break;
						}

						return _context.abrupt('return', Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_7__["generateResult"])(false, "no use exist for it"));

					case 5:
						return _context.abrupt('return', Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_7__["generateResult"])(true, "email exists"));

					case 6:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this);
	}));

	return function checkEmail(_x, _x2) {
		return _ref.apply(this, arguments);
	};
}();

/**
 * @params { email }
 * @return { success, message }
 * Query to check username exists's or not
 */
var checkUser = function () {
	var _ref3 = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(_, _ref4) {
		var username = _ref4.username;
		var user;
		return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return _user_model__WEBPACK_IMPORTED_MODULE_4__["User"].findOne({ username: username });

					case 2:
						user = _context2.sent;

						if (user) {
							_context2.next = 5;
							break;
						}

						return _context2.abrupt('return', Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_7__["generateResult"])(false, "no user exist for it"));

					case 5:
						return _context2.abrupt('return', Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_7__["generateResult"])(true, "username exists"));

					case 6:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, _this);
	}));

	return function checkUser(_x3, _x4) {
		return _ref3.apply(this, arguments);
	};
}();

var currentUser = function () {
	var _ref5 = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(_, __, _ref6) {
		var user = _ref6.user;
		var ruser;
		return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						if (!(user == undefined || !user.username)) {
							_context3.next = 2;
							break;
						}

						throw new apollo_server_express__WEBPACK_IMPORTED_MODULE_3__["AuthenticationError"]('must authenticate');

					case 2:
						_context3.next = 4;
						return _user_model__WEBPACK_IMPORTED_MODULE_4__["User"].findById(user.id);

					case 4:
						ruser = _context3.sent;

						if (ruser) {
							_context3.next = 7;
							break;
						}

						return _context3.abrupt('return', Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_7__["generateResult"])(false, "System Error"));

					case 7:
						return _context3.abrupt('return', ruser);

					case 8:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, _this);
	}));

	return function currentUser(_x5, _x6, _x7) {
		return _ref5.apply(this, arguments);
	};
}();

var getUser = function () {
	var _ref7 = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(_, _ref8, _ref9) {
		var id = _ref8.id;
		var user = _ref9.user;
		var ruser;
		return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						if (!(!user || !user.username)) {
							_context4.next = 2;
							break;
						}

						throw new apollo_server_express__WEBPACK_IMPORTED_MODULE_3__["AuthenticationError"]('must authenticate');

					case 2:
						_context4.next = 4;
						return _user_model__WEBPACK_IMPORTED_MODULE_4__["User"].findById(id).populate('organization').populate('organization.created_by');

					case 4:
						ruser = _context4.sent;

						if (ruser) {
							_context4.next = 7;
							break;
						}

						return _context4.abrupt('return', Object(_utils_resuleGenerate__WEBPACK_IMPORTED_MODULE_7__["generateResult"])(false, "System Error"));

					case 7:
						return _context4.abrupt('return', ruser);

					case 8:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, _this);
	}));

	return function getUser(_x8, _x9, _x10) {
		return _ref7.apply(this, arguments);
	};
}();

var getAllUser = function () {
	var _ref10 = babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5(_, __, _ref11) {
		var user = _ref11.user;
		var users;
		return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.next = 2;
						return _user_model__WEBPACK_IMPORTED_MODULE_4__["User"].find({});

					case 2:
						users = _context5.sent;
						return _context5.abrupt('return', users);

					case 4:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, _this);
	}));

	return function getAllUser(_x11, _x12, _x13) {
		return _ref10.apply(this, arguments);
	};
}();

var UserQuery = {
	Query: {
		getMe: function getMe() {
			return "New User";
		},
		checkEmail: checkEmail,
		checkUser: checkUser,
		currentUser: currentUser,
		getUser: getUser,
		getAllUser: getAllUser
	},
	User: {
		notification: function notification(rootUser) {
			// make query for nested fields inside user
			return {
				job_posting: {
					status: rootUser.notification.job_posting.status
				},
				company_promotion: {
					status: rootUser.notification.company_promotion.status
				},
				message: {
					status: rootUser.notification.message.status
				},
				mail: {
					status: rootUser.notification.mail.status
				},
				comment: {
					status: rootUser.notification.comment.status
				}
			};
		},
		account: function account(rootUser) {
			return rootUser.account;
		},
		social_urls: function social_urls(rootUser) {
			return rootUser.social_urls;
		},
		organization: function organization(rootUser) {
			return rootUser.organization;
		}
	}
};

/***/ }),

/***/ "./src/resources/utils/helper.js":
/*!***************************************!*\
  !*** ./src/resources/utils/helper.js ***!
  \***************************************/
/*! exports provided: ObjectCheck */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObjectCheck", function() { return ObjectCheck; });
/* harmony import */ var babel_runtime_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/core-js/object/keys */ "babel-runtime/core-js/object/keys");
/* harmony import */ var babel_runtime_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0__);

/*
	@object, @[property]
	@return boolean
*/
var ObjectCheck = function ObjectCheck(obj) {
	for (var _len = arguments.length, lists = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		lists[_key - 1] = arguments[_key];
	}

	// list is an array
	var result = true;
	var keys = babel_runtime_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0___default()(obj);
	lists.forEach(function (list) {
		if (!keys.includes(list)) {
			result = false;
			return;
		}
	});
	return result;
};



/***/ }),

/***/ "./src/resources/utils/jwt.auth.js":
/*!*****************************************!*\
  !*** ./src/resources/utils/jwt.auth.js ***!
  \*****************************************/
/*! exports provided: generateJwtToken, verifyJwtToken */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateJwtToken", function() { return generateJwtToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "verifyJwtToken", function() { return verifyJwtToken; });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__);




// sign the request
var privateCert = fs__WEBPACK_IMPORTED_MODULE_0___default.a.readFileSync(path__WEBPACK_IMPORTED_MODULE_1___default.a.resolve(__dirname, 'private.key'));
var generateJwtToken = function generateJwtToken(payload) {
	var cert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : privateCert;

	return jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default.a.sign(payload, cert, {
		algorithm: 'RS256',
		expiresIn: '30d'
	});
};

// verify the request
var publicCert = fs__WEBPACK_IMPORTED_MODULE_0___default.a.readFileSync(path__WEBPACK_IMPORTED_MODULE_1___default.a.resolve(__dirname, 'public.key'));
var verifyJwtToken = function verifyJwtToken(token) {
	var cert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : publicCert;

	try {
		return jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default.a.verify(token, cert);
	} catch (e) {
		console.log(e);
	}
};
/* WEBPACK VAR INJECTION */}.call(this, "src/resources/utils"))

/***/ }),

/***/ "./src/resources/utils/resuleGenerate.js":
/*!***********************************************!*\
  !*** ./src/resources/utils/resuleGenerate.js ***!
  \***********************************************/
/*! exports provided: generateResult */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateResult", function() { return generateResult; });
var generateResult = function generateResult(status, message) {
	return {
		status: status,
		message: message
	};
};

/***/ }),

/***/ "./src/resources/utils/resultUser.js":
/*!*******************************************!*\
  !*** ./src/resources/utils/resultUser.js ***!
  \*******************************************/
/*! exports provided: generateUser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateUser", function() { return generateUser; });
var generateUser = function generateUser(status, message, user) {
	return {
		status: status,
		message: message,
		user: user
	};
};

/***/ }),

/***/ "./src/resources/utils/tokenGenerate.js":
/*!**********************************************!*\
  !*** ./src/resources/utils/tokenGenerate.js ***!
  \**********************************************/
/*! exports provided: generateToken */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateToken", function() { return generateToken; });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);


var generateToken = function generateToken(size) {
	var buf = crypto__WEBPACK_IMPORTED_MODULE_0___default.a.randomBytes(size);
	var token = buf.toString('hex');
	return token;
};

/***/ }),

/***/ "./src/server.js":
/*!***********************!*\
  !*** ./src/server.js ***!
  \***********************/
/*! exports provided: GraphQLServer, GraphQLEngine, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GraphQLEngine", function() { return GraphQLEngine; });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _middlewares_jwt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./middlewares/jwt */ "./src/middlewares/jwt.js");
/* harmony import */ var _graphql__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./graphql */ "./src/graphql.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GraphQLServer", function() { return _graphql__WEBPACK_IMPORTED_MODULE_2__["GraphQLServer"]; });

/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./db */ "./src/db.js");
/* harmony import */ var _middlewares_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./middlewares/index */ "./src/middlewares/index.js");
/* harmony import */ var _config_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../config/index */ "./config/index.js");


var _require = __webpack_require__(/*! apollo-engine */ "apollo-engine"),
    ApolloEngine = _require.ApolloEngine;




var app = express__WEBPACK_IMPORTED_MODULE_0___default()();

/*
import for config custom middlewares
*/

Object(_middlewares_index__WEBPACK_IMPORTED_MODULE_4__["default"])(app);

Object(_db__WEBPACK_IMPORTED_MODULE_3__["resolveAll"])(); /* resolves all database connections */
/*
import for config custom modules
*/

Object(_config_index__WEBPACK_IMPORTED_MODULE_5__["default"])(app);

//Mount a jwt or other authentication middleware that is run before the GraphQL execution
// app.use('/graphql', auth)
_graphql__WEBPACK_IMPORTED_MODULE_2__["GraphQLServer"].applyMiddleware({ /* graphql configuration */
	app: app,
	path: '/graphql'
});

var GraphQLEngine = new ApolloEngine({
	apiKey: process.env.APOLLO_ENGINE_KEY
});


/* harmony default export */ __webpack_exports__["default"] = (app);

/***/ }),

/***/ 0:
/*!***********************************************!*\
  !*** multi webpack/hot/poll?1000 ./src/index ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! webpack/hot/poll?1000 */"./node_modules/webpack/hot/poll.js?1000");
module.exports = __webpack_require__(/*! ./src/index */"./src/index.js");


/***/ }),

/***/ "@sendgrid/mail":
/*!*********************************!*\
  !*** external "@sendgrid/mail" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@sendgrid/mail");

/***/ }),

/***/ "@sentry/node":
/*!*******************************!*\
  !*** external "@sentry/node" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@sentry/node");

/***/ }),

/***/ "apollo-engine":
/*!********************************!*\
  !*** external "apollo-engine" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-engine");

/***/ }),

/***/ "apollo-server-express":
/*!****************************************!*\
  !*** external "apollo-server-express" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server-express");

/***/ }),

/***/ "babel-runtime/core-js/object/keys":
/*!****************************************************!*\
  !*** external "babel-runtime/core-js/object/keys" ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/keys");

/***/ }),

/***/ "babel-runtime/core-js/promise":
/*!************************************************!*\
  !*** external "babel-runtime/core-js/promise" ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/promise");

/***/ }),

/***/ "babel-runtime/helpers/asyncToGenerator":
/*!*********************************************************!*\
  !*** external "babel-runtime/helpers/asyncToGenerator" ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/asyncToGenerator");

/***/ }),

/***/ "babel-runtime/helpers/defineProperty":
/*!*******************************************************!*\
  !*** external "babel-runtime/helpers/defineProperty" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/defineProperty");

/***/ }),

/***/ "babel-runtime/helpers/taggedTemplateLiteral":
/*!**************************************************************!*\
  !*** external "babel-runtime/helpers/taggedTemplateLiteral" ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/taggedTemplateLiteral");

/***/ }),

/***/ "babel-runtime/regenerator":
/*!********************************************!*\
  !*** external "babel-runtime/regenerator" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/regenerator");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cluster":
/*!**************************!*\
  !*** external "cluster" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cluster");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "graphql":
/*!**************************!*\
  !*** external "graphql" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql");

/***/ }),

/***/ "graphql-log":
/*!******************************!*\
  !*** external "graphql-log" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql-log");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("helmet");

/***/ }),

/***/ "host-validation":
/*!**********************************!*\
  !*** external "host-validation" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("host-validation");

/***/ }),

/***/ "hpp":
/*!**********************!*\
  !*** external "hpp" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("hpp");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "logrocket":
/*!****************************!*\
  !*** external "logrocket" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("logrocket");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "redis":
/*!************************!*\
  !*** external "redis" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("redis");

/***/ }),

/***/ "rotating-file-stream":
/*!***************************************!*\
  !*** external "rotating-file-stream" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("rotating-file-stream");

/***/ }),

/***/ "sequelize":
/*!****************************!*\
  !*** external "sequelize" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sequelize");

/***/ }),

/***/ "toobusy-js":
/*!*****************************!*\
  !*** external "toobusy-js" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("toobusy-js");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ });
//# sourceMappingURL=server.js.map