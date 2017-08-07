String.prototype.replaceAll = function(search: string, replacement: string) : string {
	return this.split(search).join(replacement);
};