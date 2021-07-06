/**
 * a dictionary for data structures used by services that metaexplorer connects with.
 * They might use different naming etc. so this dictionary exists to make it work on 
 * a technical level. Once these services offer their own Linked Data, it's better to
 * migrate to those data structures maintained by the original authors
 */
export enum LDServiceSchemaDict {
	/**
	 * where to find the wordpress installation. This might be a subdomain such as http://blog.example.com
	 */
	WordpressInstallationURL = "http://ldui.net/serviceschemas/WordpressInstallationURL",
	/**
	 * a "Category" in the way Wordpress uses the term
	 */
	WordpressCategory = "http://ldui.net/serviceschemas/WordpressCategory",
}