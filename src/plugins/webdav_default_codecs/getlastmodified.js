/*
 * Copyright ©2012 SARA bv, The Netherlands
 *
 * This file is part of js-webdav-client.
 *
 * js-webdav-client is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * js-webdav-client is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with js-webdav-client.  If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";

// If nl.sara.webdav.codec.GetlastmodifiedCodec is already defined, we have a namespace clash!
if (nl.sara.webdav.codec.GetlastmodifiedCodec !== undefined) {
  throw new nl.sara.webdav.Exception('Namespace nl.sara.webdav.codec.GetlastmodifiedCodec already taken, could not load JavaScript library for WebDAV connectivity.', nl.sara.webdav.Exception.NAMESPACE_TAKEN);
}

/**
 * @class Adds a codec that converts DAV: getlastmodified to a Date object
 * @augments nl.sara.webdav.Codec
 */
nl.sara.webdav.codec.GetlastmodifiedCodec = new nl.sara.webdav.Codec();
nl.sara.webdav.codec.GetlastmodifiedCodec.namespace = 'DAV:';
nl.sara.webdav.codec.GetlastmodifiedCodec.tagname = 'getlastmodified';

nl.sara.webdav.codec.GetlastmodifiedCodec.fromXML = function(nodelist) {
  var node = nodelist.item(0);
  if ((node.nodeType === 3) || (node.nodeType === 4)) { // Make sure text and CDATA content is stored
    return new Date(node.nodeValue);
  }else{ // If the node is not text or CDATA, then we don't parse a value at all
    return null;
  }
};

nl.sara.webdav.codec.GetlastmodifiedCodec.toXML = function(value, xmlDoc){
  function pad(text) {
    text = text.toString();
    while (text.length < 2) {
      text = '0' + text;
    }
    return text;
  }
  // I will parse this myself, because the Date object doesn't have a method which is specified to always give a rfc1123-date (defined in Section 3.3.1 of [RFC2616]). Even though Date.toUTCString() often does so, it doesn't have to.
  var wkday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var date1 = pad(value.getUTCDate()) + ' ' + month[value.getUTCMonth()] + ' ' + value.getUTCFullYear();
  var time = pad(value.getUTCHours()) + ':' + pad(value.getUTCMinutes()) + ':' + pad(value.getUTCSeconds());
  var cdata = xmlDoc.createCDATASection(wkday[value.getUTCDay()] + ', ' + date1 + ' ' + time + ' GMT');
  xmlDoc.documentElement.appendChild(cdata);
  return xmlDoc;
};

nl.sara.webdav.Property.addCodec(nl.sara.webdav.codec.GetlastmodifiedCodec);

// End of file